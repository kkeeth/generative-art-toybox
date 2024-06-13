function setup() {
  createCanvas((W = windowHeight - 50), W)
  background('#062C54')
  stroke(255)

  drawingContext.shadowBlur = 24
  drawingContext.shadowColor = 'skyblue'

  for (let i = 0; i < 500; i++) {
    let x = random(50, W - 50)
    let y = random(-50, W)

    if (random() > 0.7) {
      strokeWeight(random(1, 3))
      drawGradientLine(
        x,
        y,
        x + map(x, 50, W - 50, -24, 24),
        y + map(abs(W / 2 - x), 0, W / 2 - 50, 200, 120),
        color(255, 255, 255, 0),
        color(255, 255, 255, 255),
      )
    } else {
      strokeWeight(random(1, 8))
      point(x, y)
    }
  }
}

function drawGradientLine(x1, y1, x2, y2, c1, c2) {
  let steps = 100
  let deltaX = (x2 - x1) / steps
  let deltaY = (y2 - y1) / steps

  for (let i = 0; i < steps; i++) {
    let startX = x1 + i * deltaX
    let startY = y1 + i * deltaY
    let endX = x1 + (i + 1) * deltaX
    let endY = y1 + (i + 1) * deltaY
    let interColor = lerpColor(c1, c2, i / steps)

    stroke(interColor)
    line(startX, startY, endX, endY)
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
