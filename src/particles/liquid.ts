
import { ACTION_TYPE_STEP, PARTICLE_FAMILY_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  dispersionRate = 1;
  weight = 1;
  familyType = PARTICLE_FAMILY_TYPES.LIQUID;

  getNextStep(grid: Grid): { position: Position, action: ACTION_TYPE_STEP } {

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
    let highestXPosition: { direction: 'right' | 'left', position: Position } | undefined = undefined;
    let continueToLook = true;
    for (let i = 0; i <= Math.abs(this.weight) && continueToLook; i++) {
      const currentPositionY = this.position.y + i
      const result = this.lookForX(grid, currentPositionY, highestXPosition?.direction);
      continueToLook = result.continueToLook

      if (result.continueToLook) {
        const { positionX, direction } = result;
        highestXPosition = { position: { x: positionX, y: currentPositionY }, direction };
      }
    }

    if (highestXPosition) {
      return {
        action: ACTION_TYPE_STEP.MOVE,
        position: highestXPosition.position,
      }
    }

    return {
      action: ACTION_TYPE_STEP.STILL,
      position: this.position,
    }
  }

  private lookForX(grid: Grid, y: number, direction?: "right" | "left"): {
    continueToLook: true;
    direction: "right" | "left";
    positionX: number;
  } | {
    continueToLook: false;
  } {
    if (direction) {
      const x = this.closestPosition(grid, direction, { y, x: this.position.x }, this.dispersionRate)
      if (x !== undefined && x !== this.position.x) {
        const position = { y, x };
        return { continueToLook: true, positionX: position.x, direction };
      }

      return { continueToLook: false };
    }


    const leftPosition = { y, x: this.farestPosition(grid, 'left', { y, x: this.position.x }) };
    const rightPosition = { y, x: this.farestPosition(grid, 'right', { y, x: this.position.x }) };

    if (leftPosition.x !== this.position.x && rightPosition.x !== this.position.x) {
      if (Math.random() >= 0.5) {
        return { continueToLook: true, positionX: leftPosition.x, direction: 'left' };
      }

      return { continueToLook: true, positionX: rightPosition.x, direction: 'right' };
    }

    if (leftPosition.x !== this.position.x) {
      return { continueToLook: true, positionX: leftPosition.x, direction: 'left' };
    }

    if (rightPosition.x !== this.position.x) {
      return { continueToLook: true, positionX: rightPosition.x, direction: 'right' };
    }

    return { continueToLook: false };
  }
}