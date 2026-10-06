import { PagesFunction } from '../_shared/types';
import { jsonResponse } from '../_shared/auth';

export const onRequestGet: PagesFunction = async (context) => {
  const { env } = context;

  // Defensive check for R2 binding
  if (!env.IMAGES) {
    return jsonResponse({
      overrides: {},
      warning: 'R2 IMAGES binding not available in current environment',
    });
  }

  try {
    const object = await env.IMAGES.get('manifest/work-media.json');
    if (!object) {
      return jsonResponse(
        { overrides: {} },
        200,
        {
          'Cache-Control': 'public, max-age=10, s-maxage=10, stale-while-revalidate=60',
        }
      );
    }

    const raw = await object.json();
    let overrides: Record<string, any> = {};
    let added: any[] = [];

    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.added)) {
        added = raw.added;
        overrides = raw.overrides || {};
      } else if (raw.overrides) {
        overrides = raw.overrides;
        added = Array.isArray(raw.added) ? raw.added : [];
      } else {
        // Flat format fallback
        overrides = raw;
      }
    }

    return jsonResponse(
      { overrides, added },
      200,
      {
        'Cache-Control': 'public, max-age=10, s-maxage=10, stale-while-revalidate=60',
      }
    );
  } catch (error: any) {
    console.error('Error fetching work media manifest from R2:', error);
    return jsonResponse({ overrides: {}, added: [], error: error.message }, 200);
  }
};
