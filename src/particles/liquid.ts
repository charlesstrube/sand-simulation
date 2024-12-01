
import { PARTICLE_TYPES } from '../constants';
import { Particle } from './particle';

export class Liquid extends Particle {
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
    super(x, y, type);
  }
}