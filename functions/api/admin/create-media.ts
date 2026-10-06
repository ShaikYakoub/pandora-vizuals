import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

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
    const formData = await request.formData();
    const mediaType = (formData.get('mediaType') as string) === 'video' ? 'video' : 'photo';
    const title = (formData.get('title') as string) || '';
    const aspectRatio = (formData.get('aspectRatio') as 'photo' | '16:9' | '9:16') || (mediaType === 'video' ? '9:16' : 'photo');
    const category = (formData.get('category') as string) || (mediaType === 'video' ? 'Reels' : 'Photography');

    const primaryFile = formData.get('file') as File | null;
    const posterFile = formData.get('posterFile') as File | null;

    if (!primaryFile || !(primaryFile instanceof File)) {
      return jsonResponse({ error: 'Primary media file is required' }, 400);
    }

    if (primaryFile.size > MAX_FILE_SIZE) {
      return jsonResponse({ error: 'Primary file size exceeds maximum limit (100MB)' }, 400);
    }

    const slotId = `work-new-${Date.now()}`;
    const timestamp = Date.now();

    // 3. Upload primary file to R2
    const primaryExt = getExtension(primaryFile.name || '', primaryFile.type || '');
    const primaryFileName = `${slotId}-${timestamp}.${primaryExt}`;
    const primaryR2Key = `media/${primaryFileName}`;

    await env.IMAGES.put(primaryR2Key, primaryFile.stream(), {
      httpMetadata: {
        contentType: primaryFile.type || (mediaType === 'video' ? 'video/mp4' : 'image/webp'),
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        originalName: primaryFile.name,
        slotId,
        mediaType,
        uploadedAt: new Date().toISOString(),
      },
    });

    const primaryMediaUrl = `/api/media/${primaryFileName}`;
    let posterMediaUrl = '';

    // 4. Upload optional poster file for video
    if (posterFile && posterFile instanceof File && posterFile.size > 0) {
      const posterExt = getExtension(posterFile.name || '', posterFile.type || '');
      const posterFileName = `${slotId}-poster-${timestamp}.${posterExt}`;
      const posterR2Key = `media/${posterFileName}`;

      await env.IMAGES.put(posterR2Key, posterFile.stream(), {
        httpMetadata: {
          contentType: posterFile.type || 'image/webp',
          cacheControl: 'public, max-age=31536000, immutable',
        },
        customMetadata: {
          originalName: posterFile.name,
          slotId,
          type: 'poster',
          uploadedAt: new Date().toISOString(),
        },
      });

      posterMediaUrl = `/api/media/${posterFileName}`;
    }

    // 5. Read existing manifest
    let overrides: Record<string, any> = {};
    let added: any[] = [];
    const existingManifestObj = await env.IMAGES.get('manifest/work-media.json');
    if (existingManifestObj) {
      try {
        const raw = await existingManifestObj.json();
        if (raw && typeof raw === 'object') {
          if (Array.isArray(raw.added)) {
            added = raw.added;
            overrides = raw.overrides || {};
          } else if (raw.overrides) {
            overrides = raw.overrides;
            added = Array.isArray(raw.added) ? raw.added : [];
          } else {
            overrides = raw;
          }
        }
      } catch {
        overrides = {};
        added = [];
      }
    }

    // 6. Create new item and PREPEND to added array (latest is ALWAYS on top)
    const newItem = {
      id: slotId,
      mediaType,
      title: title.trim() || (mediaType === 'video' ? 'New Cinema Reel' : 'New Photo Shoot'),
      image: posterMediaUrl || (mediaType === 'photo' ? primaryMediaUrl : '/images/IMG_20261003_170037.webp'),
      videoUrl: mediaType === 'video' ? primaryMediaUrl : undefined,
      aspectRatio,
      category: category.trim(),
      createdAt: new Date().toISOString(),
    };

    // Prepend so latest is strictly on top
    added = [newItem, ...added];

    const updatedManifest = { overrides, added };

    // 7. Save back to R2
    await env.IMAGES.put('manifest/work-media.json', JSON.stringify(updatedManifest, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=0, must-revalidate',
      },
    });

    return jsonResponse({
      success: true,
      item: newItem,
      manifest: updatedManifest,
      message: 'New media successfully published to top of Work page',
    });
  } catch (error: any) {
    console.error('Error creating new work media:', error);
    return jsonResponse({ error: error.message || 'Failed to create new work media' }, 500);
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
