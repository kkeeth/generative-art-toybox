const ITEMS = 30
const coreOuterCircleRadius = 100
const coreInnerCircleRadius = 60
const cols = ['#0D62A3', '#FCD577', '#CB3B2A', '#006e54', '#000']

let drawJetFlg = false
let sabHeight = 0
let coreCircleYPos = 0
let jetXPosition = 0

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
  if (!drawJetFlg) {
    sabHeight = height / 8 + frameCount * 16
    coreCircleYPos = height / 2 + frameCount * 2
  }

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
    drawJetFlg = true
    noLoop()
    const id = setInterval(() => {
      bootJetArly(jetXPosition)
      jetXPosition += width / 8

      if (jetXPosition > width) {
        jetXPosition = 0
        sabHeight = height / 8
        frameCount = 0
        coreCircleYPos = height / 2

        loop()

        clearInterval(id)
        drawJetFlg = false
      }
    }, 100)
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

const bootJetArly = (i) => {
  drawingContext.shadowBlur = 3
  const baseHeight = height / 2 + height / 6
  const endHeight = height - 160

  fill(color(44, 169, 225, (i / width) * 255))

  // remove previous triangle
  triangle(
    i - width / 8,
    baseHeight,
    i - width / 8,
    endHeight,
    i,
    (endHeight + baseHeight) / 2
  )

  // draw new triangle
  triangle(
    i,
    baseHeight,
    i,
    endHeight,
    i + width / 8,
    (endHeight + baseHeight) / 2
  )
  drawingContext.shadowBlur = 30
}

mousePressed = () => {
  frameRate(0)
}

mouseReleased = () => {
  frameRate(4)
}
