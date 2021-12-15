let cWidth = 20
let cHeight = 20
let inc = 0.01
let start = 0

function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(200)

  let middle = color(50, 255, 100, 0.4 * 255);
  let from = color(255, 0, 0, 0.4 * 255);
  let to = color(0, 0, 255, 0.4 * 255);
  let xoff = start

  beginShape()
  for (let x = 0; x < width; x += cWidth) {
    let y = noise(xoff) * height
    fill(from)
    ellipse(x, y - 100, cWidth, cHeight)
    fill(to)
    ellipse(x, y + 100, cWidth, cHeight)
    stroke(240)
    fill(middle)
    vertex(x, y)


    xoff += inc
  }
  endShape()

  start += inc
}