import { HEIGHT, PARTICLE_TYPES, Position, SPAWN_AMOUNT_X, SPAWN_AMOUNT_Y, WIDTH } from "./constants";
import { createParticleFromPosition } from "./helpers";
import { Particle } from "./particles/particle";



class Grid {

  cells: (Particle | undefined)[] = [];
  constructor(height: number, width: number) {
    const cells = Array.from<undefined>({ length: height * width })
      .fill(undefined)

    this.cells = cells
  }

  isCellEmpty(position: Position) {
    return Boolean(position)
      && !this.isOutOfBounds(position.x, position.y)
      && !this.getParticle(position.x, position.y)
  }

  getIndexFromPosition(x: number, y: number): number {
    return x + y * WIDTH
  }

  getPositionFromIndex(index: number): { x: number, y: number } {
    return {
      x: index % WIDTH,
      y: Math.floor(index / WIDTH)
    }
  }

  createParticleFromPosition(position: Position, type: PARTICLE_TYPES): Particle {
    const index = this.getIndexFromPosition(position.x, position.y)
    if (this.cells[index] === undefined) {
      this.cells[index] = createParticleFromPosition(position.x, position.y, type)
    }

    return this.cells[index]
  }

  deleteParticle(x: number, y: number) {
    const index = this.getIndexFromPosition(x, y)
    this.cells[index] = undefined
  }

  updateParticle(particle: Particle) {
    const index = this.getIndexFromPosition(particle.position.x, particle.position.y)
    if (particle && particle.nextPosition) {
      particle.position = particle.nextPosition
      const newIndex = this.getIndexFromPosition(particle.nextPosition.x, particle.nextPosition.y)
      this.cells[index] = this.cells[newIndex]
      this.cells[newIndex] = particle
      particle.nextPosition = undefined
    }
  }

  commitChanges(cell: Particle,) {
    const { nextPosition } = cell

    if (nextPosition) {
      const isReachable = this.getNeighborPosition(nextPosition.x, nextPosition.y)
      if (isReachable) {
        this.updateParticle(cell)
      }
    }
  }

  shuffleArray(array: unknown[]) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray
  }

  swapCell(x1: number, y1: number, x2: number, y2: number) {
    if (this.isOutOfBounds(x1, y1) || this.isOutOfBounds(x2, y2)) {
      return;
    }

    const index1 = this.getIndexFromPosition(x1, y1);
    const index2 = this.getIndexFromPosition(x2, y2);

    [this.cells[index1], this.cells[index2]] = [this.cells[index2], this.cells[index1]];

    if (this.cells[index1]) {
      this.cells[index1].position = { x: x1, y: y1 };
    }

    if (this.cells[index2]) {
      this.cells[index2].position = { x: x2, y: y2 };
    }
  }

  addNextGeneration() {
    this.shuffleArray(this.cells)
      .filter<Particle>((cell): cell is Particle => Boolean(cell))
      .forEach((cell) => {
        if (cell.nextPosition) {
          return this.commitChanges(cell)
        }
        const { position, action } = cell.getNextStep(this)
        switch (action) {
          case 'MOVE': {
            cell.nextPosition = position
            this.commitChanges(cell)
            break;
          }
          case 'SWAP': {
            this.swapCell(position.x, position.y, cell.position.x, cell.position.y)
            break;
          }
          case 'STILL':
          default: {
            break;
          }
        }


      })
  }


  isOutOfBounds(x: number, y: number) {
    return x < 0 || x > WIDTH - 1 || y < 0 || y > HEIGHT - 1
  }



  addParticle(x: number, y: number, type: PARTICLE_TYPES) {
    for (let i = 0; i < SPAWN_AMOUNT_X; i++) {
      for (let j = 0; j < SPAWN_AMOUNT_Y; j++) {
        if (!this.isOutOfBounds(x, y)) {
          this.createParticleFromPosition({ x: x + i - 2, y: y + j - 2 }, type)
        }
      }
    }
  }

  getParticle(x: number, y: number) {
    const index = x + y * WIDTH

    if (this.isOutOfBounds(x, y)) {
      return undefined
    }

    return this.cells[index]
  }

  getNeighborPosition(x: number, y: number): undefined | Position {
    return this.isOutOfBounds(x, y - 1) ? undefined : { x, y };
  }
}

export default Grid;