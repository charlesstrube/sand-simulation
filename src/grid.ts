import { HEIGHT, Position, WIDTH } from "./constants";
import { doit } from "./helpers";
import { MovableSolid } from "./particles/movableSolid";
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



  checkNextPosition(previousNeighbors: Neighbors, previousGrid: Grid): DIRECTION {

    if (previousNeighbors.downPosition && !previousGrid.getParticle(previousNeighbors.downPosition.x, previousNeighbors.downPosition.y)) {
      return DIRECTION.DOWN
    }

    if (
      previousNeighbors.downLeftPosition
      && previousNeighbors.downRightPosition
      && !previousGrid.getParticle(previousNeighbors.downLeftPosition.x, previousNeighbors.downLeftPosition.y)
      && !previousGrid.getParticle(previousNeighbors.downRightPosition.x, previousNeighbors.downRightPosition.y)
    ) {
      return Math.random() > 0.5 ? DIRECTION.DOWN_LEFT : DIRECTION.DOWN_RIGHT
    }

    if (previousNeighbors.downLeftPosition && !previousGrid.getParticle(previousNeighbors.downLeftPosition.x, previousNeighbors.downLeftPosition.y)) {
      return DIRECTION.DOWN_LEFT
    }

    if (previousNeighbors.downRightPosition && !previousGrid.getParticle(previousNeighbors.downRightPosition.x, previousNeighbors.downRightPosition.y)) {
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

  createMovableSolidFromPosition(x: number, y: number): MovableSolid {
    const index = this.getIndexFromPosition(x, y)
    if (this.cells[index] === undefined) {
      this.cells[index] = new MovableSolid(x, y)
    }

    return this.cells[index]
  }

  createMovableSolidFromIndex(index: number): MovableSolid {
    const position = this.getPositionFromIndex(index)
    return this.createMovableSolidFromPosition(position.x, position.y)
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
    previousGrid.cells.forEach((previousCell, i) => {
      if (previousCell) {

        const previousNeighbors = previousGrid.getDirectNeighbors(previousCell.position.x, previousCell.position.y);
        const position = this.checkNextPosition(previousNeighbors, previousGrid);
        const currentNeighbors = this.getDirectNeighbors(previousCell.position.x, previousCell.position.y);

        switch (position) {
          case DIRECTION.DOWN:
            this.deleteParticle(previousCell.position.x, previousCell.position.y)
            if (currentNeighbors.downPosition) {
              const down = this.createMovableSolidFromPosition(currentNeighbors.downPosition.x, currentNeighbors.downPosition.y);
              down.color = previousCell.color;
            }

            break;
          case DIRECTION.DOWN_LEFT:
            this.deleteParticle(previousCell.position.x, previousCell.position.y)

            if (currentNeighbors.downLeftPosition) {

              const downLeft = this.createMovableSolidFromPosition(currentNeighbors.downLeftPosition.x, currentNeighbors.downLeftPosition.y);
              downLeft.color = previousCell.color;
            }
            break;
          case DIRECTION.DOWN_RIGHT:
            this.deleteParticle(previousCell.position.x, previousCell.position.y)

            if (currentNeighbors.downRightPosition) {
              const downRight = this.createMovableSolidFromPosition(currentNeighbors.downRightPosition.x, currentNeighbors.downRightPosition.y);
              downRight.color = previousCell.color;
            }
            break;
          case DIRECTION.STILL:
            const still = this.createMovableSolidFromPosition(previousCell.position.x, previousCell.position.y)
            still.color = previousCell.color;
            break;
          default:
        }

      }
    })
  }

  isOutOfBounds(x: number, y: number) {
    return x < 0 || x >= WIDTH || y < 0 || y >= WIDTH
  }

  addSand(x: number, y: number) {

    if (this.isOutOfBounds(x, y)) {
      return
    }
    const { leftPosition, rightPosition } = this.getDirectNeighbors(x, y);
    const currentCell = this.createMovableSolidFromPosition(x, y);
    const color = doit(this.colorIndex / 100)

    currentCell.color = color;

    if (leftPosition) {
      const left = this.createMovableSolidFromPosition(currentCell.position.x, currentCell.position.y);
      left.color = color;
    }
    if (rightPosition) {
      const right = this.createMovableSolidFromPosition(currentCell.position.x, currentCell.position.y);
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