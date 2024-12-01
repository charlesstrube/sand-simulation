import { HEIGHT, PARTICLE_TYPES, Position, WIDTH } from "./constants";
import { getSandColor, getWaterColor } from "./helpers";
import { Particle } from "./particles/particle";
import { Sand } from "./particles/sand";
import { Water } from "./particles/water";


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

enum DIRECTION {
  DOWN = 'DOWN',
  DOWN_LEFT = 'DOWN_LEFT',
  DOWN_RIGHT = 'DOWN_RIGHT',
  STILL = 'STILL'
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



  checkNextPosition(cell: Particle, grid: Grid): DIRECTION {
    const neinhbors = grid.getDirectNeighbors(cell.position.x, cell.position.y);

    if (cell.type === PARTICLE_TYPES.WATER && neinhbors?.downPosition) {
      console.log(grid.getParticle(neinhbors?.downPosition?.x, neinhbors?.downPosition?.y))
    }
    if (neinhbors.downPosition && !grid.getParticle(neinhbors.downPosition.x, neinhbors.downPosition.y)) {

      return DIRECTION.DOWN
    }

    if (
      neinhbors.downLeftPosition
      && neinhbors.downRightPosition
      && !grid.getParticle(neinhbors.downLeftPosition.x, neinhbors.downLeftPosition.y)
      && !grid.getParticle(neinhbors.downRightPosition.x, neinhbors.downRightPosition.y)
    ) {
      return Math.random() > 0.5 ? DIRECTION.DOWN_LEFT : DIRECTION.DOWN_RIGHT
    }

    if (
      neinhbors.downLeftPosition
      && !grid.getParticle(neinhbors.downLeftPosition.x, neinhbors.downLeftPosition.y)
    ) {
      return DIRECTION.DOWN_LEFT
    }

    if (
      neinhbors.downRightPosition
      && !grid.getParticle(neinhbors.downRightPosition.x, neinhbors.downRightPosition.y)
    ) {
      return DIRECTION.DOWN_RIGHT
    }

    return DIRECTION.STILL
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

  createParticleFromPosition(x: number, y: number, type: PARTICLE_TYPES): Particle {
    const index = this.getIndexFromPosition(x, y)
    if (this.cells[index] === undefined) {
      switch (type) {
        case PARTICLE_TYPES.WATER:
          this.cells[index] = new Water(x, y)
          break;
        case PARTICLE_TYPES.SAND:
          this.cells[index] = new Sand(x, y)
          break
        default:
          this.cells[index] = new Particle(x, y, type)
      }
    }
    return this.cells[index]

  }

  createParticleFromIndex(index: number, type: PARTICLE_TYPES): Particle {
    const position = this.getPositionFromIndex(index)
    return this.createParticleFromPosition(position.x, position.y, type)
  }

  deleteParticle(x: number, y: number) {
    const index = this.getIndexFromPosition(x, y)
    this.cells[index] = undefined
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
    previousGrid.cells.forEach((previousCell) => {
      if (previousCell) {

        const position = previousCell.position
        const nextPosition = this.checkNextPosition(previousCell, previousGrid);
        const currentNeighbors = this.getDirectNeighbors(position.x, position.y);

        switch (nextPosition) {
          case DIRECTION.DOWN: {
            this.deleteParticle(position.x, position.y)
            if (currentNeighbors.downPosition) {
              const down = this.createParticleFromPosition(currentNeighbors.downPosition.x, currentNeighbors.downPosition.y, previousCell.type);
              down.color = previousCell.color;
            }

            break;
          }
          case DIRECTION.DOWN_LEFT: {
            this.deleteParticle(position.x, position.y)

            if (currentNeighbors.downLeftPosition) {

              const downLeft = this.createParticleFromPosition(currentNeighbors.downLeftPosition.x, currentNeighbors.downLeftPosition.y, previousCell.type);
              downLeft.color = previousCell.color;
            }
            break;
          }
          case DIRECTION.DOWN_RIGHT: {
            this.deleteParticle(position.x, position.y)

            if (currentNeighbors.downRightPosition) {
              const downRight = this.createParticleFromPosition(currentNeighbors.downRightPosition.x, currentNeighbors.downRightPosition.y, previousCell.type);
              downRight.color = previousCell.color;
            }
            break;
          }
          case DIRECTION.STILL: {
            const still = this.createParticleFromPosition(position.x, position.y, previousCell.type)
            still.color = previousCell.color;
            break;
          }
          default:
        }

      }
    })
  }

  isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= WIDTH || y < 0 || y >= WIDTH
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
    const currentCell = this.createParticleFromPosition(x, y, type);
    const color = this.getColor(type)

    currentCell.color = color;

    if (leftPosition) {
      const left = this.createParticleFromPosition(leftPosition.x, leftPosition.y, type);
      left.color = color;
    }
    if (rightPosition) {
      const right = this.createParticleFromPosition(rightPosition.x, rightPosition.y, type);
      right.color = color;
    }
  }

  getParticle(x: number, y: number) {
    const index = x + y * WIDTH

    return this.cells[index]
  }

  getDirectNeighbors(x: number, y: number): Neighbors {

    const isRightEdge = x >= WIDTH - 1;
    const isLeftEdge = x <= 0;
    const isDownEdge = y >= HEIGHT - 1;
    const isUpEdge = y <= 0;


    const up = isUpEdge ? undefined : { x, y: y - 1 };
    const down = isDownEdge ? undefined : { x, y: y + 1 };
    const left = isLeftEdge ? undefined : { x: x - 1, y };
    const right = isRightEdge ? undefined : { x: x + 1, y };
    const upLeft = isLeftEdge ? undefined : { x: x - 1, y: y - 1 };
    const upRight = isRightEdge ? undefined : { x: x + 1, y: y - 1 };
    const downLeft = x - 1 < 0 || y + 1 >= HEIGHT - 1 ? undefined : { x: x - 1, y: y + 1 };
    const downRight = x + 1 > WIDTH || y + 1 >= HEIGHT ? undefined : { x: x + 1, y: y + 1 };

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