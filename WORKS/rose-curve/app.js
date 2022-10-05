const radius = 70
const space = 160

function setup() {
  createCanvas(windowWidth, windowHeight)
  stroke(220)
  noLoop()
}

function draw() {
  background(240)
  for (let v = space; v < height - space / 2; v += space) {
    for (let h = space / 1.2; h < width - space / 2; h += space) {
      drawRose(Math.floor(random(1, 9)), Math.floor(random(1, 9)), h, v)
    }
  }
}

/**
 *
 * @param {number} n numerator
 * @param {number} d denominator
 * @param {number} v vertical
 * @param {number} h horizontal
 */
function drawRose(n, d, v, h) {
  push()
  beginShape()
  translate(v, h)
  fill(random(120, 220), random(120, 220), random(120, 220))
  for (let angle = 0; angle < TWO_PI * d; angle += 0.01) {
    let range = radius * sin(angle * (n / d))

    let x = range * cos(angle)
    let y = range * sin(angle)

    vertex(x, y)
  }
  endShape(CLOSE)
  pop()
}
