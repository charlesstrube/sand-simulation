import { WIDTH } from "./constants";
import { doit } from "./helpers";
import { Particle } from "./particle";


interface Neighbors {
  up?: Particle;
  down?: Particle;
  left?: Particle;
  right?: Particle;
  upLeft?: Particle;
  upRight?: Particle;
  downLeft?: Particle;
  downRight?: Particle;
}

class Grid {

  colorIndex = 0;
  colorDirection = true;

  cells: Particle[] = [];
  constructor(height: number, width: number) {
    this.cells = Array.from({ length: height * width })
      .fill(undefined)
      .map((_, i) => {
        const particle = new Particle(i % width, Math.floor(i / width), i);

        return particle
      })
  }

  checkNextPosition(previousNeighbors: Neighbors) {

    if (previousNeighbors.down && previousNeighbors.down.alive === false) {
      return 'down'
    }

    if (previousNeighbors.downLeft && previousNeighbors.downLeft.alive === false && previousNeighbors.downRight && previousNeighbors.downRight.alive === false) {
      return Math.random() > 0.5 ? 'downLeft' : 'downRight'
    }

    if (previousNeighbors.downLeft && previousNeighbors.downLeft.alive === false) {
      return 'downLeft'
    }

    if (previousNeighbors.downRight && previousNeighbors.downRight.alive === false) {
      return 'downRight'
    }

    return 'alive'
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
      if (previousCell.alive) {
        const currentCell = this.cells[i];

        const previousNeighbors = previousGrid.getNeighbors(previousCell.position.x, previousCell.position.y);
        const position = this.checkNextPosition(previousNeighbors);
        const currentNeighbors = this.getNeighbors(previousCell.position.x, previousCell.position.y);

        switch (position) {
          case 'down':
            currentCell.alive = false;
            if (currentNeighbors.down) {
              currentNeighbors.down.color = previousCell.color;
              currentNeighbors.down.alive = true;
            }

            break;
          case 'downLeft':
            currentCell.alive = false;
            if (currentNeighbors.downLeft) {

              currentNeighbors.downLeft.color = previousCell.color;
              currentNeighbors.downLeft.alive = true;
            }
            break;
          case 'downRight':
            currentCell.alive = false;
            if (currentNeighbors.downRight) {
              currentNeighbors.downRight.color = previousCell.color;
              currentNeighbors.downRight.alive = true;
            }
            break;
          default:
            currentCell.color = previousCell.color;
            currentCell.alive = true;
        }

      }
    })
  }

  addSand(x: number, y: number) {
    const currentNeighbors = this.getNeighbors(x, y);
    const currentCell = this.getParticle(x, y);
    const { left, right } = currentNeighbors;
    const color = doit(this.colorIndex / 100)
    if (!currentCell.alive) {
      currentCell.alive = true;
      currentCell.color = color;
    }
    if (left && left.alive === false) {
      left.alive = true;
      left.color = color;
    }
    if (right && right.alive === false) {
      right.alive = true;
      right.color = color;
    }
  }

  getParticle(x: number, y: number): Particle {
    const index = x + y * WIDTH

    return this.cells[index]
  }

  getNeighbors(x: number, y: number): Neighbors {
    const up = this.getParticle(x, y - 1);
    const down = this.getParticle(x, y + 1);
    const isRightEdge = x === WIDTH - 1;
    const isLeftEdge = x === 0;
    const left = isLeftEdge ? undefined : this.getParticle(x - 1, y);
    const right = isRightEdge ? undefined : this.getParticle(x + 1, y);
    const upLeft = isLeftEdge ? undefined : this.getParticle(x - 1, y - 1);
    const upRight = isRightEdge ? undefined : this.getParticle(x + 1, y - 1);
    const downLeft = isLeftEdge ? undefined : this.getParticle(x - 1, y + 1);
    const downRight = isRightEdge ? undefined : this.getParticle(x + 1, y + 1);

    return {
      up,
      down,
      left,
      right,
      upLeft,
      upRight,
      downLeft,
      downRight
    }
  }
}

export default Grid;