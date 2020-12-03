# Imgix-Palette-Tool

The imgix URL API includes a parameter that can extract the color palette for an image served through its service: https://docs.imgix.com/apis/url/color-palette/palette.

This small library has two functions: one that returns the color palette of a given imgix-served image, and another that determines a suitable color for overlaid text on a given imgix-served image.

# Motivation

This library can be used to automatically adjust styling depending on an imgix asset's attributes. I.e., have an image's overlaid text automatically update its color styles if the image changes in any way.

# Use

## Request an imgix image's color palette

 Pass a valid imgix url string argument to `getPalette` to have it return an Object with two keys, `cssPalette` and `jsonPalette`.

 ```javascript
import { getPalette } from 'imgix-palette-tool'

const imgixUrl = 'https://www.imgix.some-img.net'
const { cssPalette, jsonPalette } = getPalette(imgixUrl)

 ```

   - `cssPalette`: the imgix-palette attributes as a css text string

  ```css
.image-fg-1 { color:#fa9e5a !important; }
.image-bg-1 { background-color:#fa9e5a !important; }
.image-fg-2 { color:#48abe6 !important; }
.image-bg-2 { background-color:#48abe6 !important; }
.image-fg-3 { color:#389cd3 !important; }
.image-bg-3 { background-color:#389cd3 !important; }
.image-fg-4 { color:#0483bc !important; }
.image-bg-4 { background-color:#0483bc !important; }
.image-fg-5 { color:#a45f59 !important; }
.image-bg-5 { background-color:#a45f59 !important; }
.image-fg-6 { color:#8f1613 !important; }
.image-bg-6 { background-color:#8f1613 !important; }
.image-fg-ex-1 { color:#ffffff !important; }
.image-bg-ex-1 { background-color:#ffffff !important; }
.image-fg-ex-2 { color:#000000 !important; }
.image-bg-ex-2 { background-color:#000000 !important; }
.image-fg-vibrant { color:#0789c5 !important; }
.image-bg-vibrant { background-color:#0789c5 !important; }
.image-fg-muted-dark { color:#354e60 !important; }
.image-bg-muted-dark { background-color:#354e60 !important; }
.image-fg-muted { color:#a45f59 !important; }
.image-bg-muted { background-color:#a45f59 !important; }
.image-fg-vibrant-light { color:#fa9e5a !important; }
.image-bg-vibrant-light { background-color:#fa9e5a !important; }
.image-fg-muted-light { color:#b2a4b1 !important; }
.image-bg-muted-light { background-color:#b2a4b1 !important; }
.image-fg-vibrant-dark { color:#027ab5 !important; }
.image-bg-vibrant-dark { background-color:#027ab5 !important; }
  ```

   - `jsonPalette`: the imgix-palette attributes as a JSON object

   ```json
   {"colors":[{"red":0.980392,"hex":"#fa9e5a","blue":0.352941,"green":0.619608},{"red":0.282353,"hex":"#48abe6","blue":0.901961,"green":0.670588},{"red":0.219608,"hex":"#389cd3","blue":0.827451,"green":0.611765},{"red":0.0156863,"hex":"#0483bc","blue":0.737255,"green":0.513725},{"red":0.643137,"hex":"#a45f59","blue":0.34902,"green":0.372549},{"red":0.560784,"hex":"#8f1613","blue":0.0745098,"green":0.0862745}],"average_luminance":0.375264,"dominant_colors":{"vibrant":{"red":0.027451,"hex":"#0789c5","blue":0.772549,"green":0.537255},"muted_light":{"red":0.698039,"hex":"#b2a4b1","blue":0.694118,"green":0.643137},"muted":{"red":0.643137,"hex":"#a45f59","blue":0.34902,"green":0.372549},"vibrant_dark":{"red":0.00784314,"hex":"#027ab5","blue":0.709804,"green":0.478431},"vibrant_light":{"red":0.980392,"hex":"#fa9e5a","blue":0.352941,"green":0.619608},"muted_dark":{"red":0.207843,"hex":"#354e60","blue":0.376471,"green":0.305882}}}
   ```

## Given a color palette, recommend the overlaid-text-color

Pass a imgix-color-palette formatted css string or JSON object to the `getOverlayColor` function and have it return a hex color that best suits text overlaid on that image palette.

 ``` javascript
 import { getPalette, getOverlayColor } from 'imgix-palette-tool'

 const imgixUrl = 'https://www.imgix.some-img.net'
 const { jsonPalette } = getPalette(imgixUrl)
 const overlayColor = getOverlayColor({json: jsonPalette})

 ```

   - `overlayColor`: hex-string representing the best color for overlaid text with the given palette

   ```string
   `#0483bc`
   ```