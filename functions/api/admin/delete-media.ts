import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  const auth = await requireAdminAuth(request, env);
  if (!auth.authorized) {
    return auth.errorResponse!;
  }

  if (!env.IMAGES) {
    return jsonResponse({ error: 'Cloudflare R2 IMAGES binding is not configured' }, 503);
  }

  try {
    const { id } = await request.json().catch(() => ({}));
    if (!id || typeof id !== 'string') {
      return jsonResponse({ error: 'Missing media item id' }, 400);
    }

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

    // Filter out the deleted item from added
    added = added.filter((item: any) => item.id !== id);

    // Track in deleted array
    if (!deleted.includes(id)) {
      deleted.push(id);
    }

    // Clean up from overrides
    if (overrides[id]) {
      delete overrides[id];
    }

    const updatedManifest = { overrides, added, deleted };

    await env.IMAGES.put('manifest/work-media.json', JSON.stringify(updatedManifest, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=0, must-revalidate',
      },
    });

    return jsonResponse({
      success: true,
      id,
      manifest: updatedManifest,
      message: `Deleted media item ${id}`,
    });
  } catch (error: any) {
    console.error('Delete error in Pages Function:', error);
    return jsonResponse({ error: error.message || 'Failed to delete media item' }, 500);
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
