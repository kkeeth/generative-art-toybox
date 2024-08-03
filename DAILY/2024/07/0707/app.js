const items = []

function setup() {
  createCanvas((W = windowHeight - 50), W, WEBGL)
  noStroke()

  for (let x = -4; x < 4; x++) {
    for (let y = -4; y < 4; y++) {
      items.push({
        x: x,
        y: y,
        size: 25,
        initY: dist(0, 0, x, y) + 3,
        img: loadImage(`ball${~~random(7)}.png`),
      })
    }
  }
}

function draw() {
  background(0)
  lights()
  rotateX(QUARTER_PI)
  randomSeed(1000)
  for (let { x, y, initY, size, pg, img } of items) {
    push()
    translate(
      x * 75 + size,
      y * 75,
      map(sin(millis() / 300 + initY), -1, 1, -80, 80),
    )
    rotateX(((frameCount + initY) / 33) * QUARTER_PI)
    random() < 0.5
      ? rotateY(((frameCount + initY) / 44) * QUARTER_PI)
      : rotateZ(((frameCount + initY) / 55) * QUARTER_PI)
    texture(img)
    sphere(size)
    pop()
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 4.5)
  }
}
