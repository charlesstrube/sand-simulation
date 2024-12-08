import { CELL_SIZE, HEIGHT, WIDTH, MATERIAL_TYPES, FPS } from './constants'
import Grid from './grid'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')



if (app) {
  const canvas = document.createElement('canvas')

  const sandButton = document.createElement('button')
  sandButton.innerText = 'Sand'
  const solidButton = document.createElement('button')
  solidButton.innerText = 'Solid'
  const waterButton = document.createElement('button')
  waterButton.innerText = 'Water'

  app.appendChild(canvas)
  app.appendChild(sandButton)
  app.appendChild(waterButton)
  app.appendChild(solidButton)

  let currentType = MATERIAL_TYPES.WATER


  sandButton.addEventListener('click', () => {
    currentType = MATERIAL_TYPES.SAND
  })
  solidButton.addEventListener('click', () => {
    currentType = MATERIAL_TYPES.EMPTY
  })
  waterButton.addEventListener('click', () => {
    currentType = MATERIAL_TYPES.WATER
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


  const fpsInterval = 1000 / FPS
  let now = Date.now()
  let then = now
  let elapsed;


  // initialize the timer variables and start the animation



  const context = canvas.getContext('2d')
  if (context) {
    context.scale(ratio, ratio)

    const grid = new Grid(HEIGHT, WIDTH)

    const loop = () => {

      window.requestAnimationFrame(loop)
      // calc elapsed time since last loop

      now = Date.now();
      elapsed = now - then;

      // if enough time has elapsed, draw the next frame

      if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here



        grid.addNextGeneration()

        if (holding && x !== undefined && y !== undefined) {
          grid.addParticle(x, y, currentType)
        }


        context.clearRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = 'black'
        context.fillRect(0, 0, CELL_SIZE * WIDTH, CELL_SIZE * HEIGHT)
        context.restore()
        grid.cells.forEach(cell => {
          if (!cell) {
            return
          }
          if (cell.color)
            context.fillStyle = cell.color
          context.fillRect(cell.position.x, cell.position.y, 1, 1)
          context.restore()
        })
      }

    }

    loop();

  }

}