import { ACTION_TYPE_STEP, PARTICLE_FAMILY_TYPES, Position } from "../constants";
import Grid from "../grid";


export class Particle {
  position: { x: number, y: number };
  color?: string;
  dispersionRate = 0;
  weight = 0;
  velocity = 0;
  familyType = PARTICLE_FAMILY_TYPES.EMPTY
  nextPosition: Position | undefined = undefined;

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.color = this.getColor();
  }

  get calculatedVelocity() {
    return Math.floor(this.velocity);
  }

  isNextPositionReachable(grid: Grid, position: Position) {
    const diffX = Math.abs(this.position.x - position.x);

    for (let offsetX = 0; offsetX <= diffX; offsetX++) {
      const checkX = this.position.x + (position.x > this.position.x ? offsetX : -offsetX);
      if (grid.isCellEmpty({ x: checkX, y: position.y })) {
        return true;
      }
    }
    return false;
  }

  getColor() {
    return '#ffffff';
  }

  increaseVelocity() {
    this.velocity += this.weight / 2;
  }

  resetVelocity() {
    this.velocity = 0;
  }

  closestPosition(grid: Grid, direction: 'left' | 'right' | 'up' | 'down', position: Position) {
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;
    const velocity = axis === 'x' ? this.dispersionRate : this.weight;

    for (let i = 1; i <= Math.abs(velocity); i++) {
      const newAxisPosition = position[axis] + sign * i
      if (grid.isCellEmpty({ ...position, [axis]: newAxisPosition })) {
        return newAxisPosition;
      } else if (i === 1) {
        return position[axis];
      }
    }

    return position[axis];
  }

  farestPosition(grid: Grid, direction: 'left' | 'right' | 'up' | 'down', position: Position) {
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;
    const velocity = axis === 'x' ? this.dispersionRate : this.weight + this.calculatedVelocity;
    let previousAxisPosition = position[axis];

    for (let i = 1; i <= Math.abs(velocity); i++) {
      const newAxisPosition = position[axis] + sign * i
      if (grid.isCellEmpty({ ...position, [axis]: newAxisPosition })) {

        previousAxisPosition = newAxisPosition;
      } else {
        return previousAxisPosition;
      }
    }

    return previousAxisPosition;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNextStep(grid: Grid): { position: Position, action: ACTION_TYPE_STEP } {
    return { position: this.position, action: ACTION_TYPE_STEP.STILL };
  }
}