// coordinates
let pX, pY, mX, mY

function setup() {
  createCanvas(400, 400)

  pX = width / 2
  pY = height / 2
}

function draw() {
  ellipse(pX, pY, 1)

  mX = random(-1, 1)
  mY = random(-1, 1)

  pX = pX + 3 * mX
  pY = pY + 3 * mY
}
