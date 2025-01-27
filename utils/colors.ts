import rgbHex from "rgb-hex";

export class Color {
  static isHex(color: string) {
    const hexRegex =
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
    return hexRegex.test(color);
  }

  static isRgb(color: string) {
    const rgbRegex =
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|0?\.\d+|1|100%))?\s*\)$/;
    return rgbRegex.test(color);
  }

  static toHex(color: string) {
    if (Color.isHex(color)) return color;
    if (Color.isRgb(color)) return rgbHex(color);
    return null;
  }
}
