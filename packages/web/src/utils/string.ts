import { theme } from "@chakra-ui/react";

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

export function truncate(str: string, maxLength: number): string {
  return str.length > maxLength ? str.substr(0, maxLength - 3) + "..." : str;
}

export function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${alpha})`
    : "";
}

export function chakraHexToRgba(color: string, alpha: number): string {
  const [one, two] = color.split(".");
  // @ts-ignore
  const hex = theme.colors[one][two];

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${alpha})`
    : "";
}
