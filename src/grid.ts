import { WIDTH } from "./constants";

interface Cell {
  alive: boolean;
  x: number;
  y: number;
  index: number;
  color?: string;
}

interface Neighbors {
  up?: Cell;
  down?: Cell;
  left?: Cell;
  right?: Cell;
  upLeft?: Cell;
  upRight?: Cell;
  downLeft?: Cell;
  downRight?: Cell;
}

const sandColors = ['#fff2f9', '#f2d2a9'];

// extract numeric r, g, b values from `rgb(nn, nn, nn)` string
function getRgb(color: string) {
  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return {
    r,
    g,
    b
  }
}

function colorInterpolate(colorA: string, colorB: string, intval: number) {
  const rgbA = getRgb(colorA);
  const rgbB = getRgb(colorB);
  const colorVal = (prop: 'r' | 'g' | 'b') =>
    Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);

  return {
    r: colorVal('r').toString(16),
    g: colorVal('g').toString(16),
    b: colorVal('b').toString(16),
  }
}


function doit(progression: number) {
  const [color1, color2] = sandColors

  const rgbNew = colorInterpolate(
    color1,
    color2,
    progression
  );

  return `#${rgbNew.r}${rgbNew.g}${rgbNew.b}`;
}

class Grid {

  colorIndex = 0;
  colorDirection = true;

  cells: Cell[] = [];
  constructor(height: number, width: number) {


    this.cells = Array.from({ length: height * width })
      .fill(undefined)
      .map((_, i) => ({
        x: i % width,
        y: Math.floor(i / width),
        alive: false,
        index: i,
        color: undefined
      }))
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

        const previousNeighbors = previousGrid.getNeighbors(previousCell.x, previousCell.y);
        const position = this.checkNextPosition(previousNeighbors);
        const currentNeighbors = this.getNeighbors(previousCell.x, previousCell.y);

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
    const nextIndex = x + y * WIDTH
    const currentNeighbors = this.getNeighbors(x, y);
    const currentCell = this.cells[nextIndex];
    const { left, right } = currentNeighbors;
    const color = doit(this.colorIndex / 100)
    currentCell.alive = true;
    currentCell.color = color;
    if (left) {
      left.alive = true;
      left.color = color;
    }
    if (right) {
      right.alive = true;
      right.color = color;
    }



  }

  getNeighbors(x: number, y: number): Neighbors {


    const up = this.cells[WIDTH * (y - 1) + x];
    const down = this.cells[WIDTH * (y + 1) + x];
    const isRightEdge = x === WIDTH - 1;
    const isLeftEdge = x === 0;
    const left = isLeftEdge ? undefined : this.cells[WIDTH * y + x - 1];
    const right = isRightEdge ? undefined : this.cells[WIDTH * y + x + 1];
    const upLeft = isLeftEdge ? undefined : this.cells[WIDTH * (y - 1) + x - 1];
    const upRight = isRightEdge ? undefined : this.cells[WIDTH * (y - 1) + x + 1];
    const downLeft = isLeftEdge ? undefined : this.cells[WIDTH * (y + 1) + x - 1];
    const downRight = isRightEdge ? undefined : this.cells[WIDTH * (y + 1) + x + 1];



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