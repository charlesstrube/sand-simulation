
import { DIRECTION, PARTICLE_TYPES } from '../constants';
import Grid from '../grid';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  constructor(x: number, y: number, type = PARTICLE_TYPES.MOVABLE_SOLID) {
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

    if (this.isCellEmpty(previous, next, neighbours.downPosition)) {
      return DIRECTION.DOWN
    }

    if (
      this.isCellEmpty(previous, next, neighbours.downLeftPosition)
      && this.isCellEmpty(previous, next, neighbours.downRightPosition)
    ) {
      const rand = Math.random() > 0.5 ? DIRECTION.DOWN_LEFT : DIRECTION.DOWN_RIGHT
      return rand
    }

    if (this.isCellEmpty(previous, next, neighbours.downRightPosition)) {
      return DIRECTION.DOWN_RIGHT
    }

    if (this.isCellEmpty(previous, next, neighbours.downLeftPosition)) {
      return DIRECTION.DOWN_LEFT
    }



    return DIRECTION.STILL
  }
}