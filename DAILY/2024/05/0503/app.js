const R = 200
const N = 12

function setup() {
  createCanvas((W = windowHeight - 50), W)
  rectMode(CENTER)
  // noLoop();
}

function draw() {
  background(255)
  translate(width / 2, height / 2)
  rotate(-millis() / 33)

  push()
  stroke('orange')
  strokeWeight(5)
  ellipse(0, 0, R + N * 6, R + N * 6)
  pop()

  push()
  noStroke()
  fill('blue')
  for (let i = 0; i < N; i++) {
    rotate(-TAU / N)
    rect(0, -R - i * 6, 20, 25, 4)
  }
  fill('red')
  rotate(TAU / N / 2)
  for (let i = N; i > 0; i--) {
    rotate(-TAU / N)
    rect(0, -(R + i * 5), 15, 20, 4)
  }
  pop()
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 5)
  }

  if (key === 'c') {
    saveCanvas('mySketch', 'jpeg')
  }
}
