import { PagesFunction } from '../../_shared/types';
import { getAdminConfig, createSessionToken, jsonResponse } from '../../_shared/auth';

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return jsonResponse({ error: 'Email and password are required' }, 400);
    }

    const config = getAdminConfig(env);

    // Case-insensitive email check, strict password check
    const normalizedInputEmail = email.trim().toLowerCase();
    const isEmailValid = normalizedInputEmail === config.email;
    const isPasswordValid = password === config.password;

    if (!isEmailValid || !isPasswordValid) {
      return jsonResponse({ error: 'Invalid email or password' }, 401);
    }

    // Generate HMAC session token
    const token = await createSessionToken(normalizedInputEmail, config.secret);

    // Set secure cookie and return token
    const cookieHeader = `pv_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 86400}; Secure`;

    return jsonResponse(
      {
        success: true,
        email: normalizedInputEmail,
        token,
        message: 'Authentication successful',
      },
      200,
      {
        'Set-Cookie': cookieHeader,
      }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return jsonResponse({ error: 'An error occurred during authentication' }, 500);
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
