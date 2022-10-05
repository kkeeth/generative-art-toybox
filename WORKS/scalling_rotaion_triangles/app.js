const sizes = [6, 9, 12, 15, 18, 21]
const maxCond = 13
let scaling = true
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
  '#52838F',
  '#577590'
]
const triangleNumber = 10
const triangles = []

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(12)
  noStroke()
  background(60)
  // blendMode(DIFFERENCE)

  for (let i = 0; i < triangleNumber; i++) {
    triangles.push(
      new ScalingTriangle(
        Math.round(random(windowWidth)),
        Math.round(random(windowHeight))
      )
    )
  }
}

function draw() {
  for (let i = 0; i < triangleNumber; i++) {
    triangles[i].update()
    triangles[i].render()
  }
}

class ScalingTriangle {
  constructor(xPos, yPos) {
    this.cond = Math.round(random(colors.length))
    this.tSize = random(sizes)
    this.maxSize = this.tSize * maxCond
    this.xPos = xPos
    this.yPos = yPos

    this.scaling = random([true, false])
    this.direction = random([-1, 1])
  }

  update() {
    this.xPos += 10
    if (this.xPos >= width) this.xPos = 0
    this.yPos += 10
    if (this.yPos >= height) this.yPos = 0

    if (this.cond === maxCond) this.scaling = !this.scaling
    this.cond = frameCount % colors.length
  }

  render() {
    push()

    fill(color(colors[this.cond]))
    translate(this.xPos, this.yPos)
    if (this.scaling) {
      polarTriangle(
        frameCount * 13 * this.direction,
        this.maxSize - this.cond * this.tSize,
        0
      )
    } else {
      polarTriangle(frameCount * 13 * this.direction, this.cond * this.tSize, 0)
    }
    pop()
  }
}
