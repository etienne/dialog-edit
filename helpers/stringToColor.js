// Taken from https://github.com/stuneak/create-color/

export default function stringToColor(string) {
  if (!string) {
    return '#000000';
  }

  const s = JSON.stringify(string);
  const hash = s.split("").reduce((a, _, i) => (a += s.charCodeAt(i) + (a << 5)), 0);
  return `#${(hash & 0x00ffffff).toString(16)}`;
}
