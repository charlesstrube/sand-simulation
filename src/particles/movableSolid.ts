
import { DIRECTION, PARTICLE_TYPES } from '../constants';
import Grid from '../grid';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  constructor(x: number, y: number, type = PARTICLE_TYPES.MOVABLE_SOLID) {
    super(x, y, type);
  }

  getNextStep(previous: Grid, next: Grid): DIRECTION {
    const neinhbors = previous.getDirectNeighbors(this.position.x, this.position.y);

    if (this.isCellEmpty(previous, next, neinhbors.downPosition)) {
      return DIRECTION.DOWN
    }

    if (
      this.isCellEmpty(previous, next, neinhbors.downLeftPosition)
      && this.isCellEmpty(previous, next, neinhbors.downRightPosition)
    ) {
      return Math.random() > 0.5 ? DIRECTION.DOWN_LEFT : DIRECTION.DOWN_RIGHT
    }

    if (this.isCellEmpty(previous, next, neinhbors.downLeftPosition)) {
      return DIRECTION.DOWN_LEFT
    }

    if (this.isCellEmpty(previous, next, neinhbors.downRightPosition)) {
      console.log('down right')
      return DIRECTION.DOWN_RIGHT
    }

    return DIRECTION.STILL
  }
}