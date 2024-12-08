import { MATERIAL_TYPES, sandColors, waterColor } from "./constants";
import { Particle } from "./particles/particle";
import { Sand } from "./particles/sand";
import { Water } from "./particles/water";


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
  const colorVal = (prop: 'r' | 'g' | 'b') => {
    const col = Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);
    return col.toString(16).padStart(2, '0')
  }

  return {
    r: colorVal('r'),
    g: colorVal('g'),
    b: colorVal('b'),
  }
}

export function getSandColor(progression: number) {
  const [color1, color2] = sandColors

  const rgbNew = colorInterpolate(
    color1,
    color2,
    progression
  );

  return `#${rgbNew.r}${rgbNew.g}${rgbNew.b}`;
}

export function getWaterColor() {
  return waterColor;
}

export function createParticleFromPosition(x: number, y: number, type: MATERIAL_TYPES) {
  switch (type) {
    case MATERIAL_TYPES.WATER:
      return new Water(x, y)
    case MATERIAL_TYPES.SAND:
      return new Sand(x, y)
    default:
      return new Particle(x, y)
  }
}