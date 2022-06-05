export function toProperCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/^_*(.)|_+(.)/g, (s, c, d) =>
      c ? c.toUpperCase() : " " + d.toUpperCase()
    );
}

export function getLetter(n: number): string {
  return String.fromCharCode(97 + n);
}
