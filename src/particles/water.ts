
import { MATERIAL_TYPES } from '../constants';
import { getWaterColor } from '../helpers';
import { Liquid } from './liquid';

let colorIndex = 0;
let colorDirection = true;

export class Water extends Liquid {
  dispersionRate = 7;
  weight = 1;
  type: MATERIAL_TYPES = MATERIAL_TYPES.WATER;

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