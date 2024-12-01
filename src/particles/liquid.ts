
import { PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  velocity = { x: 1, y: 1 };
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
    super(x, y, type);
  }

  getNextStep(previous: Grid, next: Grid): Position {
    const downPosition = { ...this.position, y: this.position.y + this.velocity.y }
    if (this.isCellEmpty(previous, next, downPosition)) {
      return downPosition
    }

    for (let velocityY = this.velocity.y; velocityY >= 0; velocityY--) {
      for (let velocityX = this.velocity.x; velocityX >= 0; velocityX--) {
        const leftPosition = { y: this.position.y + velocityY, x: this.position.x - velocityX }
        const rightPosition = { y: this.position.y + velocityY, x: this.position.x + velocityX }
        if (
          this.isCellEmpty(previous, next, leftPosition)
          && this.isCellEmpty(previous, next, rightPosition)
        ) {
          return Math.random() > 0.5 ? leftPosition : rightPosition
        }

        if (this.isCellEmpty(previous, next, rightPosition)) {
          return rightPosition
        }

        if (this.isCellEmpty(previous, next, leftPosition)) {
          return leftPosition
        }
      }
    }



    return this.position
  }

}