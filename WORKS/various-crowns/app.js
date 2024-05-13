const baseX = 50
const baseY = 115
const shapeTypes = ['triangle', 'triangle-reverse', 'circle', 'square']
const crownEdges = [3, 4, 5]

function setup() {
  createCanvas(400, 400)
  colorMode(HSB, 1)
  frameRate(1)
}

function draw() {
  background(255)
  strokeWeight(3)
  drawingContext.shadowColor = '#999'
  drawingContext.shadowBlur = 50

  push()

  // crown
  let edgeType = random(crownEdges)
  drawCrown(edgeType)
  pop()

  // circle on each edge
  let shapeType = random(shapeTypes)
  push()
  fill(0.1, 0.7, 1)
  drawEdgeShape(shapeType, edgeType)
  pop()
}

function drawTriangle(initX, initY) {
  beginShape()
  vertex(initX, initY)
  vertex(initX + 30 / sqrt(3), initY + 30)
  vertex(initX - 30 / sqrt(3), initY + 30)
  endShape(CLOSE)
}

function drawTriangleReverse(initX, initY) {
  beginShape()
  vertex(initX, initY)
  vertex(initX + 30 / sqrt(3), initY - 30)
  vertex(initX - 30 / sqrt(3), initY - 30)
  endShape(CLOSE)
}

function drawCrown(number) {
  beginShape()
  fill(random(), 0.8, 1)

  // top-left
  vertex(baseX, baseY)
  // bottom-left
  vertex(baseX + 20, baseY + 210)
  // bottom-right
  vertex(baseX + 280, baseY + 210)
  // top-right
  vertex(baseX + 300, baseY)

  let span = 0

  switch (number) {
    case 3:
      span = 300 / 4

      vertex(baseX + span * 3, baseY + 100)
      vertex(baseX + span * 2, baseY)
      vertex(baseX + span, baseY + 100)
      break
    case 4:
      span = 300 / 6

      vertex(baseX + span * 5, baseY + 100)
      vertex(baseX + span * 4, baseY)
      vertex(baseX + span * 3, baseY + 100)
      vertex(baseX + span * 2, baseY)
      vertex(baseX + span, baseY + 100)
      break
    case 5:
      span = 300 / 8

      vertex(baseX + span * 7, baseY + 100)
      vertex(baseX + span * 6, baseY)
      vertex(baseX + span * 5, baseY + 100)
      vertex(baseX + span * 4, baseY)
      vertex(baseX + span * 3, baseY + 100)
      vertex(baseX + span * 2, baseY)
      vertex(baseX + span, baseY + 100)
      break
  }
  endShape(CLOSE)
}

function drawEdgeShape(shapeType, edgeType) {
  let span = 300 / (edgeType - 1)

  switch (shapeType) {
    case 'triangle':
      drawTriangle(baseX, baseY - 40)
      drawTriangle(baseX + span, baseY - 40)
      drawTriangle(baseX + span * 2, baseY - 40)
      if (edgeType >= 4) {
        drawTriangle(baseX + span * 3, baseY - 40)
      }
      if (edgeType === 5) {
        drawTriangle(baseX + span * 4, baseY - 40)
      }
      break
    case 'triangle-reverse':
      drawTriangleReverse(baseX, baseY - 10)
      drawTriangleReverse(baseX + span, baseY - 10)
      drawTriangleReverse(baseX + span * 2, baseY - 10)
      if (edgeType >= 4) {
        drawTriangleReverse(baseX + span * 3, baseY - 10)
      }
      if (edgeType === 5) {
        drawTriangleReverse(baseX + span * 4, baseY - 10)
      }
      break
    case 'circle':
      circle(baseX, baseY - 25, 30)
      circle(baseX + span, baseY - 25, 30)
      circle(baseX + span * 2, baseY - 25, 30)
      if (edgeType >= 4) {
        circle(baseX + span * 3, baseY - 25, 30)
      }
      if (edgeType === 5) {
        circle(baseX + span * 4, baseY - 25, 30)
      }
      break
    case 'square':
      rectMode(CENTER)
      square(baseX, baseY - 25, 30)
      square(baseX + span, baseY - 25, 30)
      square(baseX + span * 2, baseY - 25, 30)
      if (edgeType >= 4) {
        square(baseX + span * 3, baseY - 25, 30)
      }
      if (edgeType === 5) {
        square(baseX + span * 4, baseY - 25, 30)
      }
      break
  }
}
