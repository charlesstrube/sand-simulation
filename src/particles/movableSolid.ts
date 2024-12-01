
import { PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  velocity = { x: 1, y: 1 };
  constructor(x: number, y: number, type = PARTICLE_TYPES.MOVABLE_SOLID) {
    super(x, y, type);
  }

  getNextStep(previous: Grid, next: Grid): Position {

    const downPosition = { ...this.position, y: this.position.y + this.velocity.y }
    if (this.isCellEmpty(previous, next, downPosition)) {
      return downPosition
    }

    const downLeftPosition = { y: this.position.y + this.velocity.y, x: this.position.x - this.velocity.x }
    const downRightPosition = { y: this.position.y + this.velocity.y, x: this.position.x + this.velocity.x }

    if (
      this.isCellEmpty(previous, next, downLeftPosition)
      && this.isCellEmpty(previous, next, downRightPosition)
    ) {
      return Math.random() > 0.5 ? downLeftPosition : downRightPosition
    }

    if (this.isCellEmpty(previous, next, downRightPosition)) {
      return downRightPosition
    }

    if (this.isCellEmpty(previous, next, downLeftPosition)) {
      return downLeftPosition
    }

    return this.position
  }
}