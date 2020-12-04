// getContent.js

/**
 * A helper that validates https request to imgix with given palette params
 * Used instead of introducing external dependency, i.e. axios or request modules
 */

const https = require('https');
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

module.exports = {
  getContent,
};
