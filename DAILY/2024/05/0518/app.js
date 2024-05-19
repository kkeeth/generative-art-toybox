function setup() {
  createCanvas(800, 600)
  background(240)
  noLoop()
  paintOilPainting()
}

function paintOilPainting() {
  let colors = [
    color(205, 92, 92), // IndianRed
    color(255, 160, 122), // LightSalmon
    color(233, 150, 122), // DarkSalmon
    color(244, 164, 96), // SandyBrown
    color(218, 165, 32), // GoldenRod
    color(139, 69, 19), // SaddleBrown
    color(188, 143, 143), // RosyBrown
    color(178, 34, 34), // FireBrick
  ]

  for (let i = 0; i < 1e3; i++) {
    let x = random(width)
    let y = random(height)
    let col = random(colors)
    let size = random(10, 50)
    let angle = random(TWO_PI)
    let alpha = random(150, 255)

    drawBrushStroke(x, y, col, size, angle, alpha)
  }
}

function drawBrushStroke(x, y, col, size, angle, alpha) {
  push()
  translate(x, y)
  rotate(angle)
  col.setAlpha(alpha)
  fill(col)
  noStroke()

  beginShape()
  for (let i = 0; i < 8; i++) {
    let offsetX = cos((TWO_PI / 8) * i) * size
    let offsetY = sin((TWO_PI / 8) * i) * size
    let noiseFactor = noise(offsetX * 0.05, offsetY * 0.05)
    offsetX *= noiseFactor
    offsetY *= noiseFactor
    vertex(offsetX, offsetY)
  }
  endShape(CLOSE)
  pop()
}

function keyPressed() {
  if (key === 'c') {
    save(`mySketch-${round(new Date().getTime() / 100000)}.jpeg`)
  }
}
