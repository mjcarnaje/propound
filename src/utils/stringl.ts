export function toProperCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/^_*(.)|_+(.)/g, (s, c, d) =>
      c ? c.toUpperCase() : " " + d.toUpperCase()
    );
}
