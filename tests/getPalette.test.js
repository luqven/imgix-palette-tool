const {getPalette} = require('../index');

test('successfully requests css and json palettes from image', () => {
  let imgixURL = 'https://assets.imgix.net/unsplash/bridge.jpg';
  getPalette(imgixURL).then(res => {
    const palette = res;
    if (!!palette && !!palette.json && !!palette.css) return true;
    return false;
  });
});
