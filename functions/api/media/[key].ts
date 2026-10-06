import { PagesFunction } from '../../_shared/types';

const MIME_MAP: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  m4v: 'video/mp4',
};

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return MIME_MAP[ext] || 'application/octet-stream';
}

export const onRequestGet: PagesFunction<any, { key: string }> = async (context) => {
  const { env, params, request } = context;

  if (!env.IMAGES) {
    return new Response('R2 IMAGES binding not configured', { status: 503 });
  }

  const rawKey = params.key;
  if (!rawKey || typeof rawKey !== 'string') {
    return new Response('Invalid media key', { status: 400 });
  }

  // Prevent path traversal
  const sanitizedKey = rawKey.replace(/[^a-zA-Z0-9._-]/g, '');
  const r2Key = `media/${sanitizedKey}`;

  try {
    const rangeHeader = request.headers.get('range');
    const object = await env.IMAGES.get(r2Key, {
      range: rangeHeader ? request.headers : undefined,
      onlyIf: request.headers,
    });

    if (!object) {
      return new Response('Media file not found in R2', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers as any);
    headers.set('etag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', '*');

    // Ensure content type is set correctly
    if (!headers.get('content-type') || headers.get('content-type') === 'application/octet-stream') {
      headers.set('content-type', getMimeType(sanitizedKey));
    }

    // Long-term immutable caching since files have timestamped unique keys
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    // Handle 206 Partial Content if range was satisfied
    const status = object.range ? 206 : 200;

    return new Response(object.body, {
      status,
      headers,
    });
  } catch (error: any) {
    console.error('Error retrieving media from R2:', error);
    return new Response('Error retrieving media', { status: 500 });
  }
};
