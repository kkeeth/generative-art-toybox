let cWidth = 20
let cHeight = 20
let inc = 0.01
let start = 0

function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(240)

  let middle = color(50, 255, 100, 0.4 * 255);
  let from = color(255, 0, 0, 0.4 * 255);
  let to = color(0, 0, 255, 0.4 * 255);
  let xoff = start

  beginShape()
  for (let x = 0; x < width; x += cWidth) {
    const y1 = noise(xoff) * height
    const y2 = noise(xoff * 1.2) * height
    const y3 = noise(xoff * 2) * height
    fill(from)
    ellipse(x, y1 - 100, cWidth, cHeight)
    fill(to)
    ellipse(x, y2 + 100, cWidth, cHeight)
    stroke(240)
    fill(middle)
    vertex(x, y3)

    xoff += inc
  }
  endShape()

  start += inc
}