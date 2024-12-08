import { HEIGHT, PARTICLE_TYPES, Position, WIDTH } from "./constants";
import { createParticleFromPosition } from "./helpers";
import { Particle } from "./particles/particle";



class Grid {

  cells: (Particle | undefined)[] = [];
  constructor(height: number, width: number) {
    const cells = Array.from<undefined>({ length: height * width })
      .fill(undefined)

    this.cells = cells
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
      this.cells[index] = undefined
      this.cells[newIndex] = particle
      particle.nextPosition = undefined
    }
  }

  commitChanges(cell: Particle, hasMoved: boolean) {
    const { nextPosition } = cell

    if (nextPosition) {
      const isReachable = this.getNeighborPosition(nextPosition.x, nextPosition.y)
      if (isReachable && hasMoved) {
        this.updateParticle(
          cell
        )
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


  addNextGeneration() {
    this.shuffleArray(this.cells)
      .filter<Particle>((cell): cell is Particle => Boolean(cell))
      .forEach((cell) => {
        const { position, hasMoved } = cell.getNextStep(this)
        cell.nextPosition = position
        this.commitChanges(cell, hasMoved)
      })
  }


  isOutOfBounds(x: number, y: number) {
    return x < 0 || x > WIDTH - 1 || y < 0 || y > HEIGHT - 1
  }



  addParticle(x: number, y: number, type: PARTICLE_TYPES) {
    if (this.isOutOfBounds(x, y)) {
      return
    }
    // const right = this.getNeighborPosition(x + 1, y);
    // const left = this.getNeighborPosition(x - 1, y);
    this.createParticleFromPosition({ x, y }, type);


    // if (left) {
    //   const particle = this.createParticleFromPosition(left, type);
    // }
    // if (right) {
    //   const particle = this.createParticleFromPosition(right, type);
    // }
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