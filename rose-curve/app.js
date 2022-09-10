const radius = 140

function setup() {
  createCanvas(windowWidth, windowHeight)
  stroke(200)
}

function draw() {
  background(180)
  translate(width / 2, height / 2)

  beginShape()
  fill((mouseY / height) * 200, (mouseX / width) * 200, 160)
  for (let angle = 0; angle < TWO_PI * 3; angle += 0.01) {
    let range = radius * sin(angle * (8 / 3))

    let x = range * cos(angle)
    let y = range * sin(angle)

    vertex(x, y)
  }
  endShape(CLOSE)
}
