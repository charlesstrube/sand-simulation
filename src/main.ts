import { CELL_SIZE, HEIGHT, WIDTH, PARTICLE_TYPES } from './constants'
import Grid from './grid'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')



if (app) {
  const canvas = document.createElement('canvas')

  const sandButton = document.createElement('button')
  const waterButton = document.createElement('button')
  sandButton.innerText = 'Sand'
  waterButton.innerText = 'Water'

  app.appendChild(canvas)
  app.appendChild(sandButton)
  app.appendChild(waterButton)

  let currentType = PARTICLE_TYPES.SAND


  sandButton.addEventListener('click', () => {
    currentType = PARTICLE_TYPES.SAND
  })
  waterButton.addEventListener('click', () => {
    currentType = PARTICLE_TYPES.WATER
  })



  const ratio = window.devicePixelRatio

  canvas.width = WIDTH * ratio;
  canvas.height = HEIGHT * ratio;
  canvas.style.width = `${WIDTH * CELL_SIZE}px`
  canvas.style.height = `${HEIGHT * CELL_SIZE}px`


  let x: undefined | number = undefined
  let y: undefined | number = undefined
  let holding = false

  canvas.addEventListener('mousedown', () => {
    holding = true
  })

  canvas.addEventListener('mouseup', () => {
    holding = false
  })

  canvas.addEventListener('mousemove', (event) => {
    x = Math.floor(event.offsetX / CELL_SIZE)
    y = Math.floor(event.offsetY / CELL_SIZE)
  })


  const context = canvas.getContext('2d')
  if (context) {
    context.scale(ratio, ratio)

    let grid = new Grid(HEIGHT, WIDTH)

    const loop = () => {
      const newGrid = new Grid(HEIGHT, WIDTH)

      newGrid.addNextGeneration(grid)

      if (holding && x !== undefined && y !== undefined) {
        newGrid.addParticle(x, y, currentType)
      }


      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = 'black'
      context.fillRect(0, 0, CELL_SIZE * WIDTH, CELL_SIZE * HEIGHT)
      context.restore()
      newGrid.cells.forEach(cell => {
        if (!cell) {
          return
        }
        if (cell.color)
          context.fillStyle = cell.color
        context.fillRect(cell.position.x, cell.position.y, CELL_SIZE, CELL_SIZE)
        context.restore()
      })
      grid = newGrid
      window.requestAnimationFrame(loop)
    }

    loop()
  }

}