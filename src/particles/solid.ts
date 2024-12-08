
import { PARTICLE_TYPES } from '../constants';

import { Particle } from './particle';

export class Solid extends Particle {
  dispersionRate = 0;
  weight = 0;
  constructor(x: number, y: number, type = PARTICLE_TYPES.SOLID) {
    super(x, y, type);
  }
}