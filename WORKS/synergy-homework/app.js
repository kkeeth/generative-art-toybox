const ITEMS = 30
const coreOuterCircleRadius = 100
const coreInnerCircleRadius = 60
const cols = ['#0D62A3', '#FCD577', '#CB3B2A', '#006e54', '#000']
const angles = [30, 45, 60, 75, 90, 135, 180]

setup = () => {
  createCanvas(windowWidth, windowHeight)
  background(120)
  frameRate(4)
}

draw = () => {
  background(255)
  noStroke()

  // draw arlies image
  push()
  randomDrawTriangles()
  randomDrawRects()
  randomDrawCircles()
  pop()

  push()
  let sabHeight = height / 8 + frameCount * 16
  let coreCircleYPos = height / 2 + frameCount * 2

  /**
   * draw my core image
   */
  drawingContext.shadowBlur = 30

  // outer dark circle
  drawingContext.shadowColor = color(0)
  fill(37)
  circle(width / 2, coreCircleYPos, coreOuterCircleRadius)

  // inner light circle
  drawingContext.shadowColor = color(240)
  fill(255)
  circle(width / 2, coreCircleYPos, coreInnerCircleRadius)

  // draw my sabotage image
  fill(50)
  rect(0, 0, width, sabHeight)
  if (sabHeight > height / 2 - coreOuterCircleRadius / 2) {
    noLoop()
    bootJetArly()

    sabHeight = height / 8
    frameCount = 0
    coreCircleYPos = height / 2
    loop()
  }

  pop()
}

const randomDrawTriangles = () => {
  for (let i = 0; i < ITEMS; i++) {
    const randomXpos = random(width)
    const randomYpos = random(height)
    const color = random(cols)
    fill(color)

    rotate(PI / random(6))

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

    rotate(PI / random(6))

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

    rotate(PI / random(6))

    noStroke()
    circle(randomXpos, randomYpos, random(60))
    stroke(color)
    line(width / 2, height / 2 + frameCount, randomXpos, randomYpos)
  }
}

const bootJetArly = () => {
  drawingContext.shadowBlur = 10
  const opacitySpan = 255 / frameCount
  const baseHeight = height / 2 + coreOuterCircleRadius
  const endHeight = height - 200

  for (let i = 0; i < width; i += width / 8) {
    push()
    fill(color(44, 169, 225, 255 - opacitySpan * 5))
    triangle(
      i,
      baseHeight,
      i,
      endHeight,
      i + width / 8,
      (endHeight + baseHeight) / 2
    )
    pop()
  }
  drawingContext.shadowBlur = 30
}

mousePressed = () => {
  frameRate(0)
}

mouseReleased = () => {
  frameRate(4)
}
