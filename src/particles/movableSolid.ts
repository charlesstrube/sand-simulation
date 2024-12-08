
import { ACTION_TYPE_STEP, PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  dispersionRate = 1;
  weight = 1;
  constructor(x: number, y: number, type = PARTICLE_TYPES.MOVABLE_SOLID) {
    super(x, y, type);
  }

  getNextStep(grid: Grid): { position: Position, action: ACTION_TYPE_STEP } {

    const downPosition = { ...this.position, y: this.position.y + this.weight }

    const downCell = grid.getParticle(downPosition.x, downPosition.y)

    if (downCell?.type === PARTICLE_TYPES.WATER) {
      return {
        action: ACTION_TYPE_STEP.SWAP,
        position: downPosition,
      }
    }

    if (grid.isCellEmpty(downPosition)) {
      return {
        action: ACTION_TYPE_STEP.MOVE,
        position: downPosition,
      }
    }

    const downLeftPosition = { y: this.position.y + this.weight, x: this.position.x - this.dispersionRate }
    const downRightPosition = { y: this.position.y + this.weight, x: this.position.x + this.dispersionRate }

    if (
      grid.isCellEmpty(downLeftPosition)
      && grid.isCellEmpty(downRightPosition)
    ) {
      return {
        action: ACTION_TYPE_STEP.MOVE,
        position: Math.random() > 0.5 ? downLeftPosition : downRightPosition,
      }
    }

    if (grid.isCellEmpty(downRightPosition)) {
      return {
        action: ACTION_TYPE_STEP.MOVE,
        position: downRightPosition,
      }
    }

    if (grid.isCellEmpty(downLeftPosition)) {
      return {
        action: ACTION_TYPE_STEP.MOVE,
        position: downLeftPosition,
      }
    }

    return {
      action: ACTION_TYPE_STEP.STILL,

      position: this.position,
    }
  }
}