
import { PARTICLE_TYPES } from '../constants';

import { Particle } from './particle';

export class Solid extends Particle {
  constructor(x: number, y: number, type = PARTICLE_TYPES.SOLID) {
    super(x, y, type);
  }
}