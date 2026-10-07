/**
 * YouTube Utility Helpers for Pandora Vizuals
 * High-performance URL parsing, thumbnail resolution, and embed generators
 */

export function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const clean = urlOrId.trim();

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // Common YouTube URL regex matching standard, share, shorts, embed & cookie variants
  const match = clean.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/i
  );

  return match ? match[1] : null;
}

export function isYouTubeUrl(urlOrId?: string | null): boolean {
  return extractYouTubeId(urlOrId) !== null;
}

export function getYouTubeThumbnail(videoIdOrUrl: string, quality: 'maxres' | 'hq' = 'maxres'): string {
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  return quality === 'maxres'
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoIdOrUrl: string, autoplay = true): string {
  const id = extractYouTubeId(videoIdOrUrl) || videoIdOrUrl;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}
