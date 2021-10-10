// coordinates
let pX, pY, mX, mY

function setup() {
  createCanvas(400, 400)
  colorMode(HSB)

  pX = width / 2
  pY = height / 2
}

function draw() {
  ellipse(pX, pY, 1)


  mX = random(-1, 1)
  mY = random(-1, 1)

  pX = pX + 3 * mX
  pY = pY + 3 * mY

  textSize(24)

  push()

  noStroke()
  rect(0, 0, 70, 40)
  text(frameCount, 10, 30)

  pop()
}
