import { sandColors } from "./constants";


// extract numeric r, g, b values from `rgb(nn, nn, nn)` string
function getRgb(color: string) {
  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return {
    r,
    g,
    b
  }
}

function colorInterpolate(colorA: string, colorB: string, intval: number) {
  const rgbA = getRgb(colorA);
  const rgbB = getRgb(colorB);
  const colorVal = (prop: 'r' | 'g' | 'b') =>
    Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);

  return {
    r: colorVal('r').toString(16),
    g: colorVal('g').toString(16),
    b: colorVal('b').toString(16),
  }
}


export function doit(progression: number) {
  const [color1, color2] = sandColors

  const rgbNew = colorInterpolate(
    color1,
    color2,
    progression
  );

  return `#${rgbNew.r}${rgbNew.g}${rgbNew.b}`;
}