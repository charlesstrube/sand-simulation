
import { Particle } from './particle';

export class Solid extends Particle {
  constructor(...parameters: ConstructorParameters<typeof Particle>) {
    super(...parameters);
  }
}