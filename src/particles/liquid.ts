
import { PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  velocity = { x: 1, y: 1 };
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
    super(x, y, type);
  }

  farestPosition(grid: Grid, direction: 'left' | 'right' | 'up' | 'down', position: Position) {
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;
    const velocityAxis = this.velocity[axis];
    let previousAxisPosition = position[axis];

    const get = (direction: 'x' | 'y', i: number) => position[direction] + sign * i;

    for (let i = 1; i <= Math.abs(velocityAxis); i++) {
      const newAxisPosition = get(axis, i)
      if (this.isCellEmpty(grid, { ...position, [axis]: newAxisPosition })) {
        previousAxisPosition = newAxisPosition;
      } else {
        return previousAxisPosition;
      }
    }

    return previousAxisPosition;
  }

  getNextStep(grid: Grid): { position: Position, hasMoved: boolean } {
    const downPosition = { ...this.position, y: this.position.y + this.velocity.y }

    // const farestDownPosition = this.farestPosition(grid, 'down', this.position);
    if (this.isCellEmpty(grid, downPosition)) {
      return {
        position: downPosition,
        hasMoved: true
      }
    }

    let highestXPosition: { direction: 'right' | 'left', position: Position } | undefined = undefined;

    let continueToLook = true;

    for (let i = 0; i <= Math.abs(this.velocity.y) && continueToLook; i++) {
      const currentPositionY = this.position.y + i
      const result = this.lookForX(grid, currentPositionY, highestXPosition?.direction);
      continueToLook = result.continueToLook

      if (result.continueToLook) {
        const { positionX, direction } = result;
        if (!highestXPosition || highestXPosition.position.x < positionX) {
          highestXPosition = { position: { x: positionX, y: currentPositionY }, direction };
        }
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
      const position = { y, x: this.farestPosition(grid, direction, { y, x: this.position.x }) };
      if (position.x !== this.position.x) {
        return { continueToLook: true, positionX: position.x, direction };
      }
      return { continueToLook: false };
    }


    const leftPosition = { y, x: this.farestPosition(grid, 'left', { y, x: this.position.x }) };
    const rightPosition = { y, x: this.farestPosition(grid, 'right', { y, x: this.position.x }) };


    if (leftPosition.x !== this.position.x && rightPosition.x !== this.position.x) {
      if (Math.random() > 0.5) {
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