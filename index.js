// index.js
const {getContent} = require('./helpers/getContent');
const {hex2RGB, getContrast, getLuminance, findSmallestContrast} = require('./helpers/colors');

/**
 * getPalette(url)
 *
 * returns css and json imgix palette object for given imgix image url
 * assumes both json and css palettes needed
 */

const getPalette = async url => {
  const palette = {};
  palette.json = await getContent(url + '?palette=json');
  palette.css = await getContent(url + '?palette=css');
  return palette;
};

/**
 * getOverlayColor(palette)
 *
 * assume the overlay text color will be white
 * checks that none of the palette colors contrast too low for white (>= 4.5 times lighter)
 * if it is, backdrop needed. Suggests dominant_color as alternate
 * returns hex color, backdrop bool, and className if available
 */

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
  let needsBackdrop = smallestContrast < 4.5;

  // determine if any other color candidates would be better
  if (needsBackdrop) {
    let i = 0;

    while (i < colors.length - 1) {
      let curColor = colors[i];
      let curLuminance = getLuminance(curColor);
      let className = Object.keys(json.dominant_colors)[i];
      let remainingColors = colors.slice(0, i).concat(colors.slice(i + 1));
      let curContrast = findSmallestContrast(remainingColors, curColor);

      if (curContrast < 4.5) {
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

module.exports = {
  getPalette,
  getOverlayColor,
};
