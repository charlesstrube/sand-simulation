
import { PARTICLE_TYPES } from '../constants';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  constructor(x: number, y: number, type = PARTICLE_TYPES.MOVABLE_SOLID) {
    super(x, y, type);
  }
}