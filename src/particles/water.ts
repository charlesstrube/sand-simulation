
import { PARTICLE_TYPES } from '../constants';
import { getWaterColor } from '../helpers';
import { Liquid } from './liquid';

let colorIndex = 0;
let colorDirection = true;

export class Water extends Liquid {
  velocity = { x: 3, y: 1 };

  constructor(x: number, y: number) {
    super(x, y, PARTICLE_TYPES.WATER);
  }

  getColor() {
    if (colorIndex >= 100) {
      colorDirection = false
    }
    if (colorIndex < 0) {
      colorDirection = true
    }

    colorIndex = colorDirection ? colorIndex + .1 : colorIndex - .1

    return getWaterColor(colorIndex / 100)
  }
}