import { HSVColor } from './colorPublisher';

function easeInOutSine(x: number) {
  return (1 - Math.cos(x * Math.PI)) / 2;
}

function uneaseInOutSine(x: number) {
  return Math.acos(1 - 2 * x) / Math.PI;
}

function easeInQuad(x: number) {
  return x * x;
}

function uneaseInQuad(x: number) {
  return Math.sqrt(x);
}

function hueToRgb(hue: number) {
  const val = hue / 60;
  const p = val % 1;

  let color = { red: 0, green: 0, blue: 0 };

  if (val <= 1 || val === 6) {
    color = { red: 1, green: p, blue: 0 };
  } else if (val <= 2) {
    color = { red: 1 - p, green: 1, blue: 0 };
  } else if (val <= 3) {
    color = { red: 0, green: 1, blue: p };
  } else if (val <= 4) {
    color = { red: 0, green: 1 - p, blue: 1 };
  } else if (val <= 5) {
    color = { red: p, green: 0, blue: 1 };
  } else {
    color = { red: 1, green: 0, blue: (1 - p) };
  }

  return {
    red: 255 * color.red,
    green: 255 * color.green,
    blue: 255 * color.blue,
  };
}

function lerp(a: number, b: number, w: number) {
  return a + (b - a) * w;
}

function hsvToRgb({ hue, saturation, value }: HSVColor) {
  const baseColorRgb = hueToRgb(hue);

  Object.keys(baseColorRgb).forEach((k) => {
    const key = k as keyof typeof baseColorRgb;
    baseColorRgb[key] = lerp(
      0,
      lerp(255, baseColorRgb[key], saturation / 100),
      value / 100,
    );
  });

  return baseColorRgb;
}

export {
  easeInOutSine, uneaseInOutSine, easeInQuad, uneaseInQuad, hsvToRgb,
};
