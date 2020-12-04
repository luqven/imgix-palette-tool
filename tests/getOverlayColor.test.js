const {getPalette, getOverlayColor} = require('../index');

test('successfully suggests overlay text color', () => {
  let imgixURL = 'https://assets.imgix.net/unsplash/bridge.jpg';
  getPalette(imgixURL).then(res => {
    const palette = res;
    const recommendedOverlayColor = getOverlayColor(palette);
    recommendedOverlayColor === {color: '#ffffff', needsBackdrop: true, className: ''};
  });
});
