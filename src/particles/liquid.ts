
import { PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  dispersionRate = 1;
  weight = 1;
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
    super(x, y, type);
  }



  getNextStep(grid: Grid): { position: Position, hasMoved: boolean } {
    const farestDownPosition = this.farestPosition(grid, 'down', this.position);
    if (farestDownPosition !== this.position.y) {
      return {
        position: { ...this.position, y: farestDownPosition },
        hasMoved: true
      }
    }

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
        position: highestXPosition.position,
        hasMoved: true
      }
    }

    return {
      position: this.position,
      hasMoved: false
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
      const position = { y, x: this.closestPosition(grid, direction, { y, x: this.position.x }) };
      if (position.x !== this.position.x) {
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