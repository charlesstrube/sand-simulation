
import { PARTICLE_FAMILY_TYPES } from '../constants';

import { Particle } from './particle';

export class Solid extends Particle {
  dispersionRate = 0;
  weight = 0;
  familyType = PARTICLE_FAMILY_TYPES.SOLID;
}