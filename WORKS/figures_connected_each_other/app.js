const ITEMS = 50
const cols = ['#0D62A3', '#FCD577', '#CB3B2A', '#006e54', '#000']
const angles = [30, 45, 60, 75, 90, 135, 210, 225, 240, 255, 270, 315]

setup = () => {
  createCanvas(windowWidth, windowHeight)
  background(50)
  frameRate(2)
  angleMode(RADIANS)
  noLoop()
}

draw = () => {
  noStroke()
  drawingContext.shadowBlur = 20
  drawingContext.shadowColor = color(255)

  // draw arlies image
  push()
  randomDrawTriangles()
  randomDrawRects()
  randomDrawCircles()
  pop()
}

const randomDrawTriangles = () => {
  for (let i = 0; i < ITEMS; i++) {
    const randomXpos = random(width)
    const randomYpos = random(height)
    const color = random(cols)
    fill(color)

    rotate(random(angles))

    noStroke()
    triangle(
      randomXpos,
      randomYpos,
      randomXpos + 20,
      randomYpos + random(0, 20),
      randomXpos + 10,
      randomYpos + random(50, 80)
    )

    stroke(color)
    line(width / 2, height / 2 + frameCount, randomXpos, randomYpos)
  }
}

const randomDrawRects = () => {
  for (let i = 0; i < ITEMS; i++) {
    const randomXpos = random(width)
    const randomYpos = random(height)
    const color = random(cols)
    fill(color)

    rotate(random(angles))

    noStroke()
    rect(randomXpos, randomYpos, random(10, 20), random(60, 90))

    stroke(color)
    line(width / 2, height / 2 + frameCount, randomXpos, randomYpos)
  }
}

const randomDrawCircles = () => {
  for (let i = 0; i < ITEMS; i++) {
    const randomXpos = random(width)
    const randomYpos = random(height)
    const color = random(cols)
    fill(color)

    rotate(random(angles))

    noStroke()
    circle(randomXpos, randomYpos, random(60))

    stroke(color)
    line(width / 2, height / 2 + frameCount, randomXpos, randomYpos)
  }
}

mouseClicked = () => {
  draw()
}
