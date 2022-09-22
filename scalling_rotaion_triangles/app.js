let cond = 0
let scalling = true
const colors = [
  '#F94144',
  '#F65A38',
  '#F3722C',
  '#F68425',
  '#F8961E',
  '#F9AF37',
  '#F9C74F',
  '#C5C35E',
  '#90BE6D',
  '#6AB47C',
  '#43AA8B',
  '#4D908E',
  '#52838F'
]

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(7)
  noStroke()
  background(80)
}

function draw() {
  translate(windowWidth / 2, windowHeight / 2)
  fill(color(colors[cond]))

  if (scalling) {
    polarTriangle(cond * 10, 360 - cond * 30, 0)
  } else {
    polarTriangle(cond * 10, cond * 30, 0)
  }

  if (cond === 12) scalling = !scalling
  cond = frameCount % 13
}
