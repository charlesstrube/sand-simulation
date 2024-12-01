import { DIRECTION, PARTICLE_TYPES, Position } from "../constants";
import Grid from "../grid";


export class Particle {
  position: { x: number, y: number };
  color?: string;
  velocity: { x: number, y: number } = { x: 0, y: 0 };
  type: PARTICLE_TYPES = PARTICLE_TYPES.MOVABLE_SOLID;
  constructor(x: number, y: number, type: PARTICLE_TYPES) {
    this.position = { x, y };
    this.type = type;
  }

  isCellEmpty(previous: Grid, next: Grid, position?: Position) {
    return position
      && !previous.getParticle(position.x, position.y)
      && !next.getParticle(position.x, position.y)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNextStep(grid: Grid, next: Grid): DIRECTION {
    return DIRECTION.STILL
  }
}