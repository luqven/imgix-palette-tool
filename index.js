// index.js
const https = require('https');

// TODO: remove this
const images = [
  'https://assets.imgix.net/unsplash/bridge.jpg',
  'https://assets.imgix.net/unsplash/pineneedles.jpg',
  'https://assets.imgix.net/unsplash/motorbike.jpg',
];

// https GET request helper
const getContent = function (url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, response => {
      // handle errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Request error, status code: ' + response.statusCode));
      }
      if (!url.includes('?palette=')) {
        reject(new Error('Invalid imgix url: must have palette param. Url: ' + url));
      }
      // parse response chunks
      const body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', err => reject(err));
  });
};

const fetchPalette = async options => {
  const {url, type} = options;
  // add the palette param to the imgix url
  const imgixUrl = url + '?palette=' + type;
  // request the image color palette from imgix API
  return await getContent(imgixUrl);
};

// returns css and json imgix palette object for given imgix image url
const getPalette = async url => {
  const palette = {};
  palette.json = await fetchPalette({url, type: 'json'});
  palette.css = await fetchPalette({url, type: 'css'});
  return palette;
};

// HEX to RGB based on GH gist: https://gist.github.com/comficker/871d378c535854c1c460f7867a191a5a#gistcomment-2615849
const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;

const hex2RGB = str => {
  const [, short, long] = String(str).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    color = {red: value >> 16, green: (value >> 8) & 0xff, blue: value & 0xff};
    color.red = color.red / 255;
    color.green = color.green / 255;
    color.blue = color.blue / 255;
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

// getContrast and helper fns from https://css-tricks.com/nailing-the-perfect-contrast-between-light-text-and-a-background-image/
const getContrast = (color1, color2) => {
  // standard RGB -> linear RGB -> luminance
  const color1_luminance = getLuminance(color1);
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

/**
 * getOverlayColor(palette)
 *
 * assume the overlay text color will be white
 * check that none of the palette colors contrast too low for white (>= 4.5 times lighter)
 * if it is, backdrop needed. Suggest dominant_color as alternate
 * return hex color, backdrop bool, and className if available
 */

const findSmallestContrast = (colors, overlayColor) => {
  let smallestContrast = Infinity;
  colors.forEach(color => {
    const currentContrast = getContrast(overlayColor, color);
    if (currentContrast < smallestContrast) smallestContrast = currentContrast;
  });
  return smallestContrast;
};

const isLowContrast = contrast => {
  return contrast < 4.5;
};

const getOverlayColor = palette => {
  const json = JSON.parse(palette.json);
  const colors = Object.values(json.dominant_colors).map(color => {
    // {"vibrant":{"red":0.027451,"hex":"#0789c5","blue":0.772549, ...}, ...}
    return color;
  });

  // determine contrast of overlay text if assumed to be white
  const overlayColorHex = '#ffffff'; // white
  let overlayColor = hex2RGB(overlayColorHex);
  overlayColor.hex = overlayColorHex;
  let className = '';
  const smallestContrast = findSmallestContrast(colors, overlayColor);
  // if contrast is too low, the overlay will need a semi-transparent backdrop
  let needsBackdrop = isLowContrast(smallestContrast);

  // determine if any other color candidates would be better
  if (needsBackdrop) {
    let i = 0;

    while (i < colors.length - 1) {
      let curColor = colors[i];
      let curLuminance = getLuminance(curColor);
      let className = Object.keys(json.dominant_colors)[i];
      let remainingColors = colors.slice(0, i).concat(colors.slice(i + 1));
      let curContrast = findSmallestContrast(remainingColors, curColor);

      if (isLowContrast(curContrast)) {
        i++;
      } else {
        overlayColor = curColor;
        needsBackdrop = false;
        break;
      }
    }
  }

  return {color: overlayColor.hex, needsBackdrop, className};
};

// TODO: remove this
getPalette(images[2]).then(res => {
  const palette = res;
  const recommendedOverlayColor = getOverlayColor(palette);
  console.log(recommendedOverlayColor);
});

module.exports = {
  getPalette,
  getOverlayColor,
};
