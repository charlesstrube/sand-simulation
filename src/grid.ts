import { HEIGHT, PARTICLE_TYPES, Position, WIDTH } from "./constants";
import { createParticleFromPosition, getSandColor, getWaterColor } from "./helpers";
import { Particle } from "./particles/particle";



class Grid {

  colorIndex = 0;
  colorDirection = true;

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

  createParticleFromIndex(index: number, type: PARTICLE_TYPES): Particle {
    const position = this.getPositionFromIndex(index)
    return this.createParticleFromPosition(position, type)
  }

  deleteParticle(x: number, y: number) {
    const index = this.getIndexFromPosition(x, y)
    this.cells[index] = undefined
  }

  commitChanges(previousCell: Particle) {
    const { nextPosition } = previousCell

    if (nextPosition) {
      const isReachable = this.getNeighborPosition(nextPosition.x, nextPosition.y)
      if (isReachable) {
        const down = this.createParticleFromPosition(
          nextPosition,
          previousCell.type
        )
        down.color = previousCell.color;
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


  addNextGeneration(previousGrid: Grid) {
    this.colorDirection = previousGrid.colorDirection
    if (previousGrid.colorIndex >= 100) {
      this.colorDirection = false
    }
    if (previousGrid.colorIndex < 0) {
      this.colorDirection = true
    }

    this.colorIndex = this.colorDirection ? previousGrid.colorIndex + .1 : previousGrid.colorIndex - .1

    const cells = this.shuffleArray(previousGrid.cells)
      .filter<Particle>((cell): cell is Particle => Boolean(cell))


    cells.forEach((previousCell) => {
      previousCell.nextPosition = previousCell.getNextStep(previousGrid, this)
      this.commitChanges(previousCell)
    })
  }


  isOutOfBounds(x: number, y: number) {
    return x < 0 || x > WIDTH - 1 || y < 0 || y > HEIGHT - 1
  }

  getColor(type: PARTICLE_TYPES) {
    switch (type) {
      case PARTICLE_TYPES.SAND:
        return getSandColor(this.colorIndex / 100)
      case PARTICLE_TYPES.WATER:
        return getWaterColor(this.colorIndex / 100)
      default:
        return '#ffffff'
    }
  }

  addParticle(x: number, y: number, type: PARTICLE_TYPES) {
    if (this.isOutOfBounds(x, y)) {
      return
    }
    const right = this.getNeighborPosition(x + 1, y);
    const left = this.getNeighborPosition(x - 1, y);
    const currentCell = this.createParticleFromPosition({ x, y }, type);
    const color = this.getColor(type)

    currentCell.color = color;

    if (left) {
      const particle = this.createParticleFromPosition(left, type);
      particle.color = color;
    }
    if (right) {
      const particle = this.createParticleFromPosition(right, type);
      particle.color = color;
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