export function getProjectMedia(value) {
  const items = Array.isArray(value) ? value : String(value || '').split(/\r?\n/);
  return [...new Set(items.map(item => String(item).trim()).filter(Boolean))];
}
export const isVideoMedia = url => /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url);
