import { PARTICLE_TYPES, Position } from "../constants";
import Grid from "../grid";


export class Particle {
  position: { x: number, y: number };
  color?: string;
  velocity: { x: number, y: number } = { x: 0, y: 0 };
  type: PARTICLE_TYPES = PARTICLE_TYPES.MOVABLE_SOLID;
  nextPosition: Position | undefined = undefined;

  constructor(x: number, y: number, type: PARTICLE_TYPES) {
    this.position = { x, y };
    this.type = type;
  }

  isCellEmpty(previous: Grid, next: Grid, position: Position) {
    return Boolean(position
      && !next.isOutOfBounds(position.x, position.y)
      && !previous.getParticle(position.x, position.y)
      && !next.getParticle(position.x, position.y));
  }

  isNextPositionReachable(previous: Grid, next: Grid, position: Position) {
    const diffX = Math.abs(this.position.x - position.x);

    for (let offsetX = 0; offsetX <= diffX; offsetX++) {
      const checkX = this.position.x + (position.x > this.position.x ? offsetX : -offsetX);
      if (this.isCellEmpty(previous, next, { x: checkX, y: position.y })) {
        return true;
      }
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNextStep(grid: Grid, next: Grid): Position {
    return this.position
  }
}