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

// TODO: remove this example
getPalette(images[0]).then(res => console.log(res));
