import { Env } from './types';

const DEFAULT_ADMIN_EMAIL = 'admin@pandoravizuals.com';
const DEFAULT_ADMIN_PASSWORD = 'PandoraVizuals2026!';
const DEFAULT_ADMIN_SECRET = 'pandora-vizuals-r2-pages-secret-key-2026';

export function getAdminConfig(env: Env) {
  return {
    email: (env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase(),
    password: env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
    secret: env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET,
  };
}

// Sign message with HMAC-SHA256 using standard Web Crypto API
async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Create a signed session token valid for 7 days
export async function createSessionToken(email: string, secret: string): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${email.toLowerCase()}|${expiresAt}`;
  const signature = await hmacSign(payload, secret);
  const combined = `${payload}|${signature}`;
  return btoa(combined);
}

// Verify a session token
export async function verifySessionToken(token: string, secret: string): Promise<{ valid: boolean; email?: string }> {
  try {
    if (!token) return { valid: false };
    const decoded = atob(token);
    const parts = decoded.split('|');
    if (parts.length !== 3) return { valid: false };

    const [email, expStr, signature] = parts;
    const expiresAt = parseInt(expStr, 10);

    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false };
    }

    const expectedSignature = await hmacSign(`${email}|${expStr}`, secret);
    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return { valid: true, email };
  } catch {
    return { valid: false };
  }
}

// Extract token from Authorization header or Cookie
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.substring(7).trim();
  }

  const cookieHeader = request.headers.get('Cookie') || request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith('pv_admin_token=')) {
        return cookie.substring('pv_admin_token='.length).trim();
      }
    }
  }

  return null;
}

// Authenticate an incoming admin request
export async function requireAdminAuth(request: Request, env: Env): Promise<{ authorized: boolean; email?: string; errorResponse?: Response }> {
  const token = extractToken(request);
  if (!token) {
    return {
      authorized: false,
      errorResponse: jsonResponse({ error: 'Unauthorized: Missing authentication token' }, 401),
    };
  }

  const config = getAdminConfig(env);
  const result = await verifySessionToken(token, config.secret);

  if (!result.valid) {
    return {
      authorized: false,
      errorResponse: jsonResponse({ error: 'Unauthorized: Invalid or expired session token' }, 401),
    };
  }

  return { authorized: true, email: result.email };
}

// Standard JSON response builder
export function jsonResponse(data: any, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  });
}
