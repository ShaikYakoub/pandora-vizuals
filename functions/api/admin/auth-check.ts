import { PagesFunction } from '../../_shared/types';
import { requireAdminAuth, jsonResponse } from '../../_shared/auth';

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;

  const auth = await requireAdminAuth(request, env);
  if (!auth.authorized) {
    return jsonResponse({ authenticated: false, error: 'Not authenticated' }, 401);
  }

  return jsonResponse({
    authenticated: true,
    email: auth.email,
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
