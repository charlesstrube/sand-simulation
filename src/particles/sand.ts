
import { MATERIAL_TYPES } from '../constants';
import { getSandColor } from '../helpers';
import { MovableSolid } from './movableSolid';

let colorIndex = 0;
let colorDirection = true;


export class Sand extends MovableSolid {
  materialType: MATERIAL_TYPES = MATERIAL_TYPES.SAND;

  getColor() {
    if (colorIndex >= 100) {
      colorDirection = false
    }
    if (colorIndex < 0) {
      colorDirection = true
    }

    colorIndex = colorDirection ? colorIndex + .1 : colorIndex - .1

    return getSandColor(colorIndex / 100)
  }
}