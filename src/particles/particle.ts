import { PARTICLE_TYPES, Position } from "../constants";
import Grid from "../grid";


export class Particle {
  position: { x: number, y: number };
  color?: string;
  dispersionRate = 0;
  weight = 0;

  type: PARTICLE_TYPES = PARTICLE_TYPES.MOVABLE_SOLID;
  nextPosition: Position | undefined = undefined;

  constructor(x: number, y: number, type: PARTICLE_TYPES) {
    this.position = { x, y };
    this.type = type;
    this.color = this.getColor();
  }

  isCellEmpty(grid: Grid, position: Position) {
    return Boolean(position)
      && !grid.isOutOfBounds(position.x, position.y)
      && !grid.getParticle(position.x, position.y)
  }

  isNextPositionReachable(grid: Grid, position: Position) {
    const diffX = Math.abs(this.position.x - position.x);

    for (let offsetX = 0; offsetX <= diffX; offsetX++) {
      const checkX = this.position.x + (position.x > this.position.x ? offsetX : -offsetX);
      if (this.isCellEmpty(grid, { x: checkX, y: position.y })) {
        return true;
      }
    }
    return false;
  }

  getColor() {
    return '#ffffff';
  }

  farestPosition(grid: Grid, direction: 'left' | 'right' | 'up' | 'down', position: Position) {
    const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;
    const velocity = axis === 'x' ? this.dispersionRate : this.weight;
    let previousAxisPosition = position[axis];

    for (let i = 1; i <= Math.abs(velocity); i++) {
      const newAxisPosition = position[axis] + sign * i
      if (this.isCellEmpty(grid, { ...position, [axis]: newAxisPosition })) {
        previousAxisPosition = newAxisPosition;
      } else {
        return previousAxisPosition;
      }
    }

    return previousAxisPosition;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNextStep(grid: Grid): { position: Position, hasMoved: boolean } {
    return { position: this.position, hasMoved: false };
  }
}