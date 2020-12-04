/**
 * colors.js
 *
 * a collection of helper functions that interpret RGB colors
 *
 * hex2RGB(str):
 * converts a hex string into an rgb & hex object, i.e. {red: , green:, blue:, hex}
 *
 * getContrast(color1, color2):
 * calculates the contrast between lighter and darker luminances
 *
 * getLuminance({red, green, blue}):
 * calculates the luminance of an RGB color
 *
 * convertToLinearRBG(color_sRGB):
 * converts standard RGB to linear RGB
 *
 * findSmallestContrast(colors, targetColor):
 * finds the color with smallest contrast to target color
 */

// HEX to RGB based on GH gist: https://gist.github.com/comficker/871d378c535854c1c460f7867a191a5a#gistcomment-2615849
const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;

const hex2RGB = str => {
  const [, short, long] = String(str).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    color = {red: value >> 16, green: (value >> 8) & 0xff, blue: value & 0xff, hex: str};
    color.red = color.red / 255;
    color.green = color.green / 255;
    color.blue = color.blue / 255;
    color.hex = str;
    return color;
  } else if (short) {
    const rgbArr = Array.from(short, s => Number.parseInt(s, 16)).map(n => (n << 4) | n);
    const color = {};
    color.red = rgbArr[0] / 255;
    color.green = rgbArr[1] / 255;
    color.blue = rgbArr[2] / 255;
    return color;
  }
};

// getContrast, getLuminance, and convertToLinearRBG from https://css-tricks.com/nailing-the-perfect-contrast-between-light-text-and-a-background-image/
const getContrast = (color1, color2) => {
  const color1_luminance = getLuminance(color1); // standard RGB -> linear RGB -> luminance
  const color2_luminance = getLuminance(color2);
  const lighterColorLuminance = Math.max(color1_luminance, color2_luminance);
  const darkerColorLuminance = Math.min(color1_luminance, color2_luminance);
  const contrast = (lighterColorLuminance + 0.05) / (darkerColorLuminance + 0.05);
  return contrast;
};

function getLuminance({red, green, blue}) {
  return (
    0.2126 * convertToLinearRBG(red) +
    0.7152 * convertToLinearRBG(green) +
    0.0722 * convertToLinearRBG(blue)
  );
}

function convertToLinearRBG(primaryColor_sRGB) {
  const primaryColor_linear =
    primaryColor_sRGB < 0.03928
      ? primaryColor_sRGB / 12.92
      : Math.pow((primaryColor_sRGB + 0.055) / 1.055, 2.4);
  return primaryColor_linear;
}

// find the smallest contrast between a color in array and overlayColor
const findSmallestContrast = (colors, overlayColor) => {
  let smallestContrast = Infinity;
  colors.forEach(color => {
    const currentContrast = getContrast(overlayColor, color);
    if (currentContrast < smallestContrast) smallestContrast = currentContrast;
  });
  return smallestContrast;
};

module.exports = {
  hex2RGB,
  getContrast,
  getLuminance,
  findSmallestContrast,
};
