import { PARTICLE_TYPES } from "../constants";



export class Particle {
  position: { x: number, y: number };
  color?: string;
  velocity: { x: number, y: number } = { x: 0, y: 0 };
  constructor(x: number, y: number) {
    this.position = { x, y };
  }
}