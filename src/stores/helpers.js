export function getNewId(ids) {
  if (ids && Array.isArray(ids) && ids.length) {
    return ids.reduce((maxId, id) => Math.max(id, maxId), -1) + 1;
  }
  return 1;
}

export function getColorClass(string) {
  if (!string || string.length === 0) {
    return;
  };

  let hash = 0, i, chr;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 4) - hash) + chr;
    hash |= 0;
  }
  const id = (Math.abs(hash) % 16) + 1;
  return `color-${id}`;
}
