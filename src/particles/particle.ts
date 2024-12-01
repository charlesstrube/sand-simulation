import { PARTICLE_TYPES } from "../constants";



export class Particle {
  position: { x: number, y: number };
  color?: string;
  velocity: { x: number, y: number } = { x: 0, y: 0 };
  type: PARTICLE_TYPES = PARTICLE_TYPES.MOVABLE_SOLID;
  constructor(x: number, y: number, type: PARTICLE_TYPES) {
    this.position = { x, y };
    this.type = type;
  }
}