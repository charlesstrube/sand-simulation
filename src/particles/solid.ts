
import { PARTICLE_TYPES } from '../constants';

import { Particle } from './particle';

export class Solid extends Particle {
  velocity = { x: 0, y: 0 };
  constructor(x: number, y: number, type = PARTICLE_TYPES.SOLID) {
    super(x, y, type);
  }
}