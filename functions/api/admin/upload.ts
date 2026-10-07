import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';
import { isValidWorkSlot } from '../../_shared/slots';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

function getExtension(filename: string, mimeType: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    const ext = parts.pop()?.toLowerCase();
    if (ext && /^[a-z0-9]+$/.test(ext)) {
      return ext;
    }
  }

  // Fallback from MIME
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
    const slotId = formData.get('slotId') as string;
    const mediaField = (formData.get('mediaField') as string) || 'image';
    const file = formData.get('file') as File | null;

    if (!slotId) {
      return jsonResponse({ error: 'Missing slotId' }, 400);
    }

    // 3. Strict slot authorization: ONLY Work page slots allowed
    if (!isValidWorkSlot(slotId)) {
      return jsonResponse(
        { error: `Unauthorized slot: "${slotId}". Only designated Work page media slots are editable.` },
        400
      );
    }

    if (!file || !(file instanceof File)) {
      return jsonResponse({ error: 'No file uploaded or invalid file format' }, 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse({ error: 'File size exceeds maximum allowed limit (100MB)' }, 400);
    }

    // 4. Generate unique R2 key
    const extension = getExtension(file.name || '', file.type || '');
    const cleanFileName = `${slotId}-${Date.now()}.${extension}`;
    const r2Key = `media/${cleanFileName}`;

    // 5. Stream file into R2
    await env.IMAGES.put(r2Key, file.stream(), {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        originalName: file.name,
        slotId,
        mediaField,
        uploadedAt: new Date().toISOString(),
      },
    });

    const publicMediaUrl = `/api/media/${cleanFileName}`;

    // 6. Update manifest in R2
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

    // If uploading to a previously deleted slot, un-delete it
    deleted = deleted.filter((d: any) => d !== slotId);

    if (slotId.startsWith('work-new-')) {
      const idx = added.findIndex((item: any) => item.id === slotId);
      if (idx !== -1) {
        added[idx] = {
          ...added[idx],
          [mediaField]: publicMediaUrl,
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      overrides[slotId] = {
        ...(overrides[slotId] || {}),
        [mediaField]: publicMediaUrl,
        updatedAt: new Date().toISOString(),
      };
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
      slotId,
      mediaField,
      mediaUrl: publicMediaUrl,
      manifest: updatedManifest,
      message: `Successfully replaced ${mediaField} for slot ${slotId}`,
    });
  } catch (error: any) {
    console.error('Upload error in Pages Function:', error);
    return jsonResponse({ error: error.message || 'Failed to upload media to R2' }, 500);
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
