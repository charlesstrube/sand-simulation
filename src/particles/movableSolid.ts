
import { PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  dispersionRate = 1;
  weight = 1;
  constructor(x: number, y: number, type = PARTICLE_TYPES.MOVABLE_SOLID) {
    super(x, y, type);
  }

  getNextStep(previous: Grid): { position: Position, hasMoved: boolean } {

    const downPosition = { ...this.position, y: this.position.y + this.weight }
    if (this.isCellEmpty(previous, downPosition)) {
      return {
        position: downPosition,
        hasMoved: true
      }
    }

    const downLeftPosition = { y: this.position.y + this.weight, x: this.position.x - this.dispersionRate }
    const downRightPosition = { y: this.position.y + this.weight, x: this.position.x + this.dispersionRate }

    if (
      this.isCellEmpty(previous, downLeftPosition)
      && this.isCellEmpty(previous, downRightPosition)
    ) {
      return {
        position: Math.random() > 0.5 ? downLeftPosition : downRightPosition,
        hasMoved: true
      }
    }

    if (this.isCellEmpty(previous, downRightPosition)) {
      return {
        position: downRightPosition,
        hasMoved: true
      }
    }

    if (this.isCellEmpty(previous, downLeftPosition)) {
      return {
        position: downLeftPosition,
        hasMoved: true
      }
    }

    return {
      position: this.position,
      hasMoved: false
    }
  }
}