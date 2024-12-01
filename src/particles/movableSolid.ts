
import { Solid } from './solid';

export class MovableSolid extends Solid {
  constructor(...parameters: ConstructorParameters<typeof Solid>) {
    super(...parameters);
  }
}