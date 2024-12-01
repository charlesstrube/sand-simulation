
import { DIRECTION, PARTICLE_TYPES } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
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
      return DIRECTION.DOWN_RIGHT
    }

    if (
      this.isCellEmpty(previous, next, neinhbors.leftPosition)
      && this.isCellEmpty(previous, next, neinhbors.rightPosition)
    ) {
      return Math.random() > 0.5 ? DIRECTION.LEFT : DIRECTION.RIGHT
    }

    if (this.isCellEmpty(previous, next, neinhbors.rightPosition)) {
      return DIRECTION.RIGHT
    }

    if (this.isCellEmpty(previous, next, neinhbors.leftPosition)) {
      return DIRECTION.LEFT
    }

    return DIRECTION.STILL
  }
}