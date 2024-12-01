


export class Particle {
  alive: boolean;
  position: { x: number, y: number };
  index: number;
  color?: string;
  velocity: { x: number, y: number } = { x: 0, y: 0 };
  constructor(x: number, y: number, index: number) {
    this.alive = false;
    this.position = { x, y };
    this.index = index;
  }
}