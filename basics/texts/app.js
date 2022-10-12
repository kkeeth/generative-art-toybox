function setup() {
  createCanvas(720, 400)
  noStroke()
}

function draw() {
  background(102)

  push()
  translate(width / 2, height / 2)
  rotate(frameCount / -50.0)
  star(0, 0, 27, 70, 5)
  pop()
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints
  let halfAngle = angle / 2.0
  beginShape()
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2
    let sy = y + sin(a) * radius2
    vertex(sx, sy)
    push()
    fill(color(255, 200, 0))
    ellipse(sx, sy, 10, 10)
    pop()

    sx = x + cos(a + halfAngle) * radius1
    sy = y + sin(a + halfAngle) * radius1
    vertex(sx, sy)
  }
  endShape(CLOSE)
}
