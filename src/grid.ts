import { DIRECTION, HEIGHT, PARTICLE_TYPES, Position, WIDTH } from "./constants";
import { createParticleFromPosition, getSandColor, getWaterColor } from "./helpers";
import { Particle } from "./particles/particle";

interface Neighbors {
  upPosition?: Position;
  downPosition?: Position;
  leftPosition?: Position;
  rightPosition?: Position;
  upLeftPosition?: Position;
  upRightPosition?: Position;
  downLeftPosition?: Position;
  downRightPosition?: Position;
}

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
    const position = previousCell.position
    const nextPosition = previousCell.nextStep
    const currentNeighbors = this.getDirectNeighbors(position.x, position.y);

    switch (nextPosition) {
      case DIRECTION.DOWN: {
        if (currentNeighbors.downPosition) {
          const down = this.createParticleFromPosition(
            currentNeighbors.downPosition,
            previousCell.type
          );
          down.color = previousCell.color;
        }
        break;
      }
      case DIRECTION.DOWN_LEFT: {
        if (currentNeighbors.downLeftPosition) {
          const downLeft = this.createParticleFromPosition(
            currentNeighbors.downLeftPosition,
            previousCell.type
          );
          downLeft.color = previousCell.color;
        }
        break;
      }
      case DIRECTION.DOWN_RIGHT: {
        if (currentNeighbors.downRightPosition) {
          const downRight = this.createParticleFromPosition(
            currentNeighbors.downRightPosition,
            previousCell.type
          );
          downRight.color = previousCell.color;
        }
        break;
      }
      case DIRECTION.RIGHT: {
        if (currentNeighbors.rightPosition) {
          const right = this.createParticleFromPosition(
            currentNeighbors.rightPosition,
            previousCell.type
          );
          right.color = previousCell.color;
        }
        break;
      }
      case DIRECTION.LEFT: {
        if (currentNeighbors.leftPosition) {
          const left = this.createParticleFromPosition(
            currentNeighbors.leftPosition,
            previousCell.type
          );
          left.color = previousCell.color;
        }
        break;
      }
      case DIRECTION.STILL: {
        const still = this.createParticleFromPosition(position, previousCell.type)
        still.color = previousCell.color;
        break;
      }
      default:
    }
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

    const cells = previousGrid.cells
      .filter<Particle>((cell): cell is Particle => Boolean(cell))


    cells.forEach((previousCell) => {
      previousCell.nextStep = previousCell.getNextStep(previousGrid, this)
      this.commitChanges(previousCell)
    })
    cells.forEach((previousCell) => {
      if (!previousCell.nextStep) {
        previousCell.nextStep = previousCell.getNextFallbackStep(previousGrid, this)
        this.commitChanges(previousCell)
      }
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
    const { leftPosition, rightPosition } = this.getDirectNeighbors(x, y);
    const currentCell = this.createParticleFromPosition({ x, y }, type);
    const color = this.getColor(type)

    currentCell.color = color;

    if (leftPosition) {
      const left = this.createParticleFromPosition(leftPosition, type);
      left.color = color;
    }
    if (rightPosition) {
      const right = this.createParticleFromPosition(rightPosition, type);
      right.color = color;
    }
  }

  getParticle(x: number, y: number) {
    const index = x + y * WIDTH

    return this.cells[index]
  }

  getDirectNeighbors(x: number, y: number): Neighbors {

    const up = this.isOutOfBounds(x, y - 1) ? undefined : { x, y: y - 1 };
    const down = this.isOutOfBounds(x, y + 1) ? undefined : { x, y: y + 1 };
    const left = this.isOutOfBounds(x - 1, y) ? undefined : { x: x - 1, y };
    const right = this.isOutOfBounds(x + 1, y) ? undefined : { x: x + 1, y };
    const upLeft = this.isOutOfBounds(x - 1, y - 1) ? undefined : { x: x - 1, y: y - 1 };
    const upRight = this.isOutOfBounds(x + 1, y - 1) ? undefined : { x: x + 1, y: y - 1 };
    const downLeft = this.isOutOfBounds(x - 1, y + 1) ? undefined : { x: x - 1, y: y + 1 };
    const downRight = this.isOutOfBounds(x + 1, y + 1) ? undefined : { x: x + 1, y: y + 1 };

    return {
      upPosition: up,
      downPosition: down,
      leftPosition: left,
      rightPosition: right,
      upLeftPosition: upLeft,
      upRightPosition: upRight,
      downLeftPosition: downLeft,
      downRightPosition: downRight
    }
  }
}

export default Grid;