
import { PARTICLE_TYPES } from '../constants';
import { Liquid } from './liquid';

export class Water extends Liquid {
  velocity = { x: 3, y: 2 };

  constructor(x: number, y: number) {
    super(x, y, PARTICLE_TYPES.WATER);
  }
}