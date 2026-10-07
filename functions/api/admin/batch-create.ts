import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

function getExtension(filename: string, mimeType: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase();
    if (ext && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
  }

  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('mp4')) return 'mp4';
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('quicktime')) return 'mov';
  return 'bin';
}

function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const clean = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

interface StagedItemMeta {
  type: 'photo' | 'video';
  fileIndex?: number;
  youtubeUrl?: string;
  aspectRatio?: 'photo' | '16:9' | '9:16';
  title?: string;
  category?: string;
}

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  // 1. Verify authentication
  const auth = await requireAdminAuth(request, env);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  // 2. Verify R2 binding
  if (!env.IMAGES) {
    return jsonResponse({ error: 'Cloudflare R2 IMAGES binding is not configured' }, 503);
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    const newItems: any[] = [];
    const baseTimestamp = Date.now();

    if (contentType.includes('application/json')) {
      // JSON payload (e.g. batch YouTube links)
      const body = await request.json();
      const items: StagedItemMeta[] = Array.isArray(body.items) ? body.items : [];

      if (items.length === 0) {
        return jsonResponse({ error: 'No items provided in batch request' }, 400);
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const timestamp = baseTimestamp + i;
        const slotId = `work-new-${timestamp}`;

        if (item.type === 'video' && item.youtubeUrl) {
          const cleanUrl = item.youtubeUrl.trim();
          const ytId = extractYouTubeId(cleanUrl);
          const isShorts = cleanUrl.toLowerCase().includes('/shorts/');
          const aspectRatio = item.aspectRatio || (isShorts ? '9:16' : '16:9');
          const category = aspectRatio === '9:16' ? 'Reels' : 'Cinema';
          const posterUrl = ytId
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
            : '/images/IMG_20261003_170037.webp';

          newItems.push({
            id: slotId,
            mediaType: 'video',
            title: item.title?.trim() || (aspectRatio === '9:16' ? 'Reel' : 'Cinema Video'),
            image: posterUrl,
            videoUrl: cleanUrl,
            aspectRatio,
            category,
            createdAt: new Date(timestamp).toISOString(),
          });
        }
      }
    } else if (contentType.includes('multipart/form-data')) {
      // Multipart payload (Photos or uploaded video files + optional YouTube items)
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];
      const metadataStr = formData.get('metadata') as string | null;
      const defaultAspectRatio = (formData.get('aspectRatio') as string) || 'photo';

      let itemsMeta: StagedItemMeta[] = [];
      if (metadataStr) {
        try {
          itemsMeta = JSON.parse(metadataStr);
        } catch {
          itemsMeta = [];
        }
      }

      // If specific metadata was provided per item
      if (itemsMeta.length > 0) {
        for (let i = 0; i < itemsMeta.length; i++) {
          const meta = itemsMeta[i];
          const timestamp = baseTimestamp + i;
          const slotId = `work-new-${timestamp}`;

          if (meta.type === 'video' && meta.youtubeUrl) {
            // YouTube link item
            const cleanUrl = meta.youtubeUrl.trim();
            const ytId = extractYouTubeId(cleanUrl);
            const isShorts = cleanUrl.toLowerCase().includes('/shorts/');
            const aspectRatio = meta.aspectRatio || (isShorts ? '9:16' : '16:9');
            const posterUrl = ytId
              ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
              : '/images/IMG_20261003_170037.webp';

            newItems.push({
              id: slotId,
              mediaType: 'video',
              title: meta.title?.trim() || (aspectRatio === '9:16' ? 'Reel' : 'Cinema Video'),
              image: posterUrl,
              videoUrl: cleanUrl,
              aspectRatio,
              category: aspectRatio === '9:16' ? 'Reels' : 'Cinema',
              createdAt: new Date(timestamp).toISOString(),
            });
          } else if (typeof meta.fileIndex === 'number' && files[meta.fileIndex]) {
            // File upload item
            const file = files[meta.fileIndex];
            if (file instanceof File && file.size > 0 && file.size <= MAX_FILE_SIZE) {
              const ext = getExtension(file.name || '', file.type || '');
              const fileName = `${slotId}.${ext}`;
              const r2Key = `media/${fileName}`;

              await env.IMAGES.put(r2Key, file.stream(), {
                httpMetadata: {
                  contentType: file.type || (meta.type === 'video' ? 'video/mp4' : 'image/webp'),
                  cacheControl: 'public, max-age=31536000, immutable',
                },
                customMetadata: {
                  originalName: file.name,
                  slotId,
                  mediaType: meta.type,
                  uploadedAt: new Date(timestamp).toISOString(),
                },
              });

              const mediaUrl = `/api/media/${fileName}`;
              const isVideo = meta.type === 'video';
              const aspectRatio = meta.aspectRatio || (isVideo ? '9:16' : 'photo');

              newItems.push({
                id: slotId,
                mediaType: meta.type,
                title: meta.title?.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'New Media',
                image: isVideo ? '/images/IMG_20261003_170037.webp' : mediaUrl,
                videoUrl: isVideo ? mediaUrl : undefined,
                aspectRatio,
                category: isVideo ? (aspectRatio === '9:16' ? 'Reels' : 'Cinema') : 'Photography',
                createdAt: new Date(timestamp).toISOString(),
              });
            }
          }
        }
      } else {
        // Fallback: standard multiple files upload without custom metadata
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!(file instanceof File) || file.size === 0) continue;
          if (file.size > MAX_FILE_SIZE) continue;

          const timestamp = baseTimestamp + i;
          const slotId = `work-new-${timestamp}`;
          const isVideo = file.type.startsWith('video/');
          const ext = getExtension(file.name || '', file.type || '');
          const fileName = `${slotId}.${ext}`;
          const r2Key = `media/${fileName}`;

          await env.IMAGES.put(r2Key, file.stream(), {
            httpMetadata: {
              contentType: file.type || (isVideo ? 'video/mp4' : 'image/webp'),
              cacheControl: 'public, max-age=31536000, immutable',
            },
            customMetadata: {
              originalName: file.name,
              slotId,
              mediaType: isVideo ? 'video' : 'photo',
              uploadedAt: new Date(timestamp).toISOString(),
            },
          });

          const mediaUrl = `/api/media/${fileName}`;
          const aspectRatio = (defaultAspectRatio as 'photo' | '16:9' | '9:16') || (isVideo ? '9:16' : 'photo');

          newItems.push({
            id: slotId,
            mediaType: isVideo ? 'video' : 'photo',
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || (isVideo ? 'Video' : 'Photo'),
            image: isVideo ? '/images/IMG_20261003_170037.webp' : mediaUrl,
            videoUrl: isVideo ? mediaUrl : undefined,
            aspectRatio,
            category: isVideo ? (aspectRatio === '9:16' ? 'Reels' : 'Cinema') : 'Photography',
            createdAt: new Date(timestamp).toISOString(),
          });
        }
      }
    } else {
      return jsonResponse({ error: 'Unsupported Content-Type' }, 400);
    }

    if (newItems.length === 0) {
      return jsonResponse({ error: 'No valid items were created' }, 400);
    }

    // 3. Atomically update manifest in R2
    let overrides: Record<string, any> = {};
    let added: any[] = [];
    let deleted: string[] = [];

    const existingManifestObj = await env.IMAGES.get('manifest/work-media.json');
    if (existingManifestObj) {
      try {
        const raw = await existingManifestObj.json();
        if (raw && typeof raw === 'object') {
          overrides = raw.overrides || {};
          added = Array.isArray(raw.added) ? raw.added : [];
          deleted = Array.isArray(raw.deleted) ? raw.deleted : [];
        }
      } catch {
        overrides = {};
        added = [];
        deleted = [];
      }
    }

    // Prepend new items so latest items are always on top of the Work page
    const updatedAdded = [...newItems, ...added];
    const updatedManifest = { overrides, added: updatedAdded, deleted };

    await env.IMAGES.put('manifest/work-media.json', JSON.stringify(updatedManifest, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=0, must-revalidate',
      },
    });

    return jsonResponse({
      success: true,
      count: newItems.length,
      items: newItems,
      manifest: updatedManifest,
      message: `Successfully published ${newItems.length} items to top of Work page`,
    });
  } catch (error: any) {
    console.error('Error in batch-create:', error);
    return jsonResponse({ error: error.message || 'Failed to batch create media items' }, 500);
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
