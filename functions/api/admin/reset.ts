import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';
import { isValidWorkSlot } from '../../_shared/slots';

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
    const { slotId, mediaField } = body as { slotId?: string; mediaField?: 'image' | 'videoUrl' | 'all' };

    if (!slotId) {
      return jsonResponse({ error: 'Missing slotId' }, 400);
    }

    if (!isValidWorkSlot(slotId)) {
      return jsonResponse(
        { error: `Unauthorized slot: "${slotId}". Only designated Work page media slots are editable.` },
        400
      );
    }

    let overrides: Record<string, any> = {};
    let added: any[] = [];
    const existing = await env.IMAGES.get('manifest/work-media.json');
    if (existing) {
      try {
        const raw = await existing.json();
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

    if (slotId.startsWith('work-new-')) {
      added = added.filter((item: any) => item.id !== slotId);
    } else if (overrides[slotId]) {
      if (mediaField && mediaField !== 'all') {
        delete overrides[slotId][mediaField];
        const remainingKeys = Object.keys(overrides[slotId]).filter((k) => k !== 'updatedAt');
        if (remainingKeys.length === 0) {
          delete overrides[slotId];
        } else {
          overrides[slotId].updatedAt = new Date().toISOString();
        }
      } else {
        delete overrides[slotId];
      }
    }

    const updatedManifest = { overrides, added };

    await env.IMAGES.put('manifest/work-media.json', JSON.stringify(updatedManifest, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=0, must-revalidate',
      },
    });

    return jsonResponse({
      success: true,
      slotId,
      manifest: updatedManifest,
      message: `Reset slot ${slotId} to default static media`,
    });
  } catch (error: any) {
    console.error('Reset error in Pages Function:', error);
    return jsonResponse({ error: error.message || 'Failed to reset slot override' }, 500);
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
