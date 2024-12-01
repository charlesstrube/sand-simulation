
import { DIRECTION, PARTICLE_TYPES } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
    super(x, y, type);
  }

  getNextStep(previous: Grid, next: Grid): undefined | DIRECTION {
    const neighbours = previous.getDirectNeighbors(this.position.x, this.position.y);
    if (this.isCellEmpty(previous, next, neighbours.downPosition)) {
      return DIRECTION.DOWN
    }

    return undefined
  }

  getNextFallbackStep(previous: Grid, next: Grid): DIRECTION {
    const neighbours = previous.getDirectNeighbors(this.position.x, this.position.y);

    if (
      this.isCellEmpty(previous, next, neighbours.downLeftPosition)
      && this.isCellEmpty(previous, next, neighbours.downRightPosition)
    ) {
      return Math.random() > 0.5 ? DIRECTION.DOWN_LEFT : DIRECTION.DOWN_RIGHT
    }

    if (this.isCellEmpty(previous, next, neighbours.downLeftPosition)) {
      return DIRECTION.DOWN_LEFT
    }

    if (this.isCellEmpty(previous, next, neighbours.downRightPosition)) {
      return DIRECTION.DOWN_RIGHT
    }

    if (
      this.isCellEmpty(previous, next, neighbours.leftPosition)
      && this.isCellEmpty(previous, next, neighbours.rightPosition)
    ) {
      return Math.random() > 0.5 ? DIRECTION.LEFT : DIRECTION.RIGHT
    }

    if (this.isCellEmpty(previous, next, neighbours.rightPosition)) {
      return DIRECTION.RIGHT
    }

    if (this.isCellEmpty(previous, next, neighbours.leftPosition)) {
      return DIRECTION.LEFT
    }

    return DIRECTION.STILL
  }
}