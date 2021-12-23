let w, center

function setup() {
  createCanvas(w = windowHeight, w)
  frameRate(7)
  center = w / 2
}

function draw() {
  background(50)

  // snow
  for (let i = 0; i < 30; i++) {
    push()
    stroke('#fff')
    strokeWeight(int(random(8)))
    point(random(w), random(w))
    pop()
  }

  // Triangle1
  noStroke()
  fill(0, 255, 80)
  translate(0, w / 2)
  triangle(center, 0, center - 100, 120, center + 100, 120)

  // Triangle2
  translate(0, 60)
  triangle(center, 0, center - 100, 120, center + 100, 120)

  // Triangle3
  translate(0, 60)
  triangle(center, 0, center - 110, 120, center + 110, 120)

  // decorations
  push()
  fill(60, 0, 255)
  ellipse(w / 2 - 20, -60, 20, 20)
  fill(255, 40, 0)
  ellipse(w / 2 + 20, -40, 20, 20)
  fill(60, 0, 255)
  ellipse(w / 2 + 40, 0, 20, 20)
  fill(255, 40, 0)
  ellipse(w / 2, 10, 20, 20)
  fill(60, 0, 255)
  ellipse(w / 2 - 40, 30, 20, 20)
  fill(255, 40, 0)
  ellipse(w / 2 -20, 45, 20, 20)
  fill(60, 0, 255)
  ellipse(w / 2 + 20, 60, 20, 20)
  fill(255, 40, 0)
  ellipse(w / 2 + 60, 90, 20, 20)
  fill(60, 0, 255)
  ellipse(w / 2 - 30, 90, 20, 20)
  pop()

  // trunk
  fill(165, 82, 42)
  rect(w / 2 - 20, 120, 40, 120)

  // star
  translate(w / 2, -130)
  star(0, 0, 20, 50, 5)
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints
  let halfAngle = angle / 2.0
  fill(255, 255, 0)
  rotate(frameCount / -40.0)

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE)
}

