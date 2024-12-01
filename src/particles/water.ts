
import { PARTICLE_TYPES } from '../constants';
import { Liquid } from './liquid';

export class Water extends Liquid {
  constructor(x: number, y: number) {
    super(x, y, PARTICLE_TYPES.WATER);
  }
}