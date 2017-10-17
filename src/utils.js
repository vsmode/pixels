/**
 * Sets the color of a single pixel at an x/y coord in a Uint8ClampedArray
 */
type setPixelOptions = {
  w: number,
  x: number,
  y: number,
  color: [number, number, number, number],
  buffer: Uint8ClampedArray
};
export const setPixel = ({
  width,
  x,
  y,
  color,
  buffer
}: setPixelOptions): Uint8ClampedArray => {
  const n = (y * width + x) * 4;
  const pixels = Uint8ClampedArray.from(buffer);
  for (let i = 0; i < 4; i++) pixels[i + n] = color[i];
  return pixels;
};

/**
 * Gets the color of a single pixel at an x/y coord in a Uint8ClampedArray
 */
type getPixelOptions = {
  w: number,
  x: number,
  y: number,
  buffer: Uint8ClampedArray
};
export const getPixel = ({
  width,
  x,
  y,
  buffer
}: getPixelOptions): Uint8ClampedArray => {
  const n = (y * width + x) * 4;
  return Uint8ClampedArray.of(
    buffer[0 + n],
    buffer[1 + n],
    buffer[2 + n],
    buffer[3 + n]
  );
};

/**
 * Uses a predicate function to set one pixel at a time in a Uint8ClampedArray
 */
export const mapPixels = (
  fn: (
    pixel: [number, number, number, number],
    i: number
  ) => [number, number, number, number],
  buffer: Uint8ClampedArray
): Uint8ClampedArray => {
  const pixels = Uint8ClampedArray.from(buffer);
  const { length } = pixels;
  for (let i = 0; i <= length; i += 4) {
    const px = fn(pixels.slice(i, i + 4), i);
    pixels[i + 0] = px[0];
    pixels[i + 1] = px[1];
    pixels[i + 2] = px[2];
    pixels[i + 3] = px[3];
  }
  return pixels;
};

/**
 * Merges two Uint8ClampedArrays filling any transparent pixels
 */
export const mergePixels = (
  a: Uint8ClampedArray,
  b: Uint8ClampedArray
): Uint8ClampedArray => {
  const c = Uint8ClampedArray.from(b);
  const { length } = c;
  for (let i = 0; i < length; i += 4) {
    // not transparent
    if (c[i + 3] > 0) continue;
    // if transparent, fill in pixel with other buffer
    for (let j = 0; j <= 4; j++) c[i + j] = a[i + j];
  }
  // console.log(c);
  return c;
};

/**
 * Color helpers
 * https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
 */

export const lightenRGB = (color, percent) => {
  var f = color.split(','),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = parseInt(f[0].slice(4)),
    G = parseInt(f[1]),
    B = parseInt(f[2]);
  return (
    'rgb(' +
    (Math.round((t - R) * p) + R) +
    ',' +
    (Math.round((t - G) * p) + G) +
    ',' +
    (Math.round((t - B) * p) + B) +
    ')'
  );
};

export const lightenHex = (color, percent) => {
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return (
    '#' +
    (0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B))
      .toString(16)
      .slice(1)
  );
};

export const lighten = (color, percent) => {
  if (color.length > 7) return lightenRGB(color, percent);
  else return lightenHex(color, percent);
};

export const toRGBA = (c, a = 1) =>
  `rgba(${c[0] === '#'
    ? [
        c.replace('#', '0x') >> 16,
        (c.replace('#', '0x') >> 8) & 0xff,
        c.replace('#', '0x') & 0xff,
        a
      ]
    : [
        ...c
          .replace(/\s/, '')
          .replace('rgba', '')
          .replace('rgb', '')
          .replace('(', '')
          .replace(')', '')
          .split(',')
          .map(n => Number(n))
          .slice(0, 3),
        a
      ]})`;

/**
 * Gives back the index of value where predicate returns `true`
 */
export const indexWhere = (
  f: (*, number, Array<*>) => boolean,
  xs: Array<*>
): ?number => {
  let i = 0;
  for (const x of xs) {
    if (f(x, i, xs)) return i;
    i++;
  }
};

export const toDataURI = (ctx => (layers, w, h) =>
  layers[0].frames.map((_, frame) => {
    const arrayBufferView = layers
      .map(x => !x.hidden && x.frames[frame]) // current frame
      .reduce(
        (a, b) => (b ? mergePixels(a, b) : a),
        new Uint8ClampedArray(4 * w * h)
      );
    const imgData = new ImageData(arrayBufferView, w, h);
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    ctx.putImageData(imgData, 0, 0);
    return ctx.canvas.toDataURL();
  }))(document.createElement('canvas').getContext('2d'));

export const debounce = (cb, ms) => {
  let timeout = null;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb(...args), ms);
  };
};
