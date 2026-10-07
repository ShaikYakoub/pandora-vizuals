import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';
import { isValidWorkSlot } from '../../_shared/slots';

function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const clean = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
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
    const body = await request.json().catch(() => ({}));
    const { slotId, videoUrl, image } = body;

    if (!slotId || typeof slotId !== 'string') {
      return jsonResponse({ error: 'Missing slotId' }, 400);
    }

    if (!isValidWorkSlot(slotId)) {
      return jsonResponse({ error: `Invalid or unauthorized slot: "${slotId}"` }, 400);
    }

    if (!videoUrl || typeof videoUrl !== 'string') {
      return jsonResponse({ error: 'Missing videoUrl or YouTube link' }, 400);
    }

    const cleanVideoUrl = videoUrl.trim();
    const youtubeId = extractYouTubeId(cleanVideoUrl);
    const posterUrl =
      typeof image === 'string' && image.trim().length > 0
        ? image.trim()
        : youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        : undefined;

    // 3. Read current manifest from R2
    let overrides: Record<string, any> = {};
    let added: any[] = [];
    let deleted: string[] = [];
    const existing = await env.IMAGES.get('manifest/work-media.json');
    if (existing) {
      try {
        const raw = await existing.json();
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

    // 4. Update manifest
    if (slotId.startsWith('work-new-')) {
      added = added.map((item: any) => {
        if (item.id === slotId) {
          return {
            ...item,
            videoUrl: cleanVideoUrl,
            ...(posterUrl ? { image: posterUrl } : {}),
          };
        }
        return item;
      });
    } else {
      overrides[slotId] = {
        ...(overrides[slotId] || {}),
        videoUrl: cleanVideoUrl,
        ...(posterUrl ? { image: posterUrl } : {}),
      };
    }

    const updatedManifest = { overrides, added, deleted };

    // 5. Persist to R2
    await env.IMAGES.put('manifest/work-media.json', JSON.stringify(updatedManifest, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=0, must-revalidate',
      },
    });

    return jsonResponse({
      success: true,
      slotId,
      videoUrl: cleanVideoUrl,
      image: posterUrl,
      manifest: updatedManifest,
      message: `Updated YouTube link for slot ${slotId}`,
    });
  } catch (error: any) {
    console.error('Error updating link:', error);
    return jsonResponse({ error: error.message || 'Failed to update video link' }, 500);
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
