
import { ACTION_TYPE_STEP, PARTICLE_SOLID_FAMILY_TYPES, Position, PARTICLE_FAMILY_TYPES } from '../constants';
import Grid from '../grid';
import { Solid } from './solid';

export class MovableSolid extends Solid {
  dispersionRate = 1;
  weight = 1;
  solidType = PARTICLE_SOLID_FAMILY_TYPES.MOVABLE_SOLID;



  getNextStep(grid: Grid): { position: Position, action: ACTION_TYPE_STEP } {

    const downPosition = { ...this.position, y: this.position.y + this.weight }
    const downCell = grid.getParticle(downPosition.x, downPosition.y)

    if (downCell?.familyType === PARTICLE_FAMILY_TYPES.LIQUID) {
      this.resetVelocity()

      return {
        action: ACTION_TYPE_STEP.SWAP,
        position: downPosition,
      }
    }

    const farestDownPosition = this.farestPosition(grid, 'down', this.position);
    if (farestDownPosition !== this.position.y) {
      this.increaseVelocity()

      return {
        action: ACTION_TYPE_STEP.MOVE,
        position: { ...this.position, y: farestDownPosition },
      }
    }

    /**
     * Past this point, the particle is not free falling
     */
    this.resetVelocity()

    const downLeftPosition = { y: this.position.y + this.weight, x: this.position.x - this.dispersionRate }
    const downRightPosition = { y: this.position.y + this.weight, x: this.position.x + this.dispersionRate }

    if (grid.isCellEmpty(downLeftPosition) && grid.isCellEmpty(downRightPosition)) {
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