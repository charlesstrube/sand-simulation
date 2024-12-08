
import { MATERIAL_TYPES, waterColor } from '../constants';
import { Liquid } from './liquid';

export class Water extends Liquid {
  dispersionRate = 7;
  weight = 1;
  materialType: MATERIAL_TYPES = MATERIAL_TYPES.WATER;

  getColor() {
    return waterColor
  }
}