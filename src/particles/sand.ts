
import { PARTICLE_TYPES } from '../constants';
import { MovableSolid } from './movableSolid';

export class Sand extends MovableSolid {
  constructor(x: number, y: number) {
    super(x, y, PARTICLE_TYPES.SAND);
  }
}