
import { PARTICLE_TYPES, Position } from '../constants';
import Grid from '../grid';
import { Particle } from './particle';

export class Liquid extends Particle {
  velocity = { x: 1, y: 1 };
  constructor(x: number, y: number, type = PARTICLE_TYPES.LIQUID) {
    super(x, y, type);
  }

  getFarest(grid: Grid, direction: 'left' | 'right') {
    const axis = direction === 'left' ? 'x' : 'x';
    const sign = direction === 'left' ? -1 : 1;
    const velocityAxis = this.velocity[axis];
    let previousAxisPosition = this.position[axis];

    const get = (direction: 'x' | 'y', i: number) => this.position[direction] + sign * i;

    for (let i = 1; i <= Math.abs(velocityAxis); i++) {
      const newAxisPosition = get(axis, i)
      if (this.isCellEmpty(grid, { ...this.position, [axis]: newAxisPosition })) {
        previousAxisPosition = newAxisPosition;
      } else {
        return previousAxisPosition;
      }
    }

    return previousAxisPosition;
  }

  getNextStep(grid: Grid): { position: Position, hasMoved: boolean } {
    const downPosition = { ...this.position, y: this.position.y + this.velocity.y }
    if (this.isCellEmpty(grid, downPosition)) {
      return {
        position: downPosition,
        hasMoved: true
      }
    }

    const leftPosition = { y: this.position.y, x: this.getFarest(grid, 'left') }
    const rightPosition = { y: this.position.y, x: this.getFarest(grid, 'right') }

    if (
      leftPosition.x !== this.position.x && rightPosition.x !== this.position.x
    ) {
      return {
        position: Math.random() > 0.5 ? leftPosition : rightPosition,
        hasMoved: true
      }
    }

    if (leftPosition.x !== this.position.x) {
      return {
        position: leftPosition,
        hasMoved: true
      }
    }

    if (rightPosition.x !== this.position.x) {
      return {
        position: rightPosition,
        hasMoved: true
      }
    }



    return {
      position: this.position,
      hasMoved: false
    }

  }

}