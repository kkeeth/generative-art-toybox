const items = []
const SPLIT = 3
const LAYER = 5
let t = 0

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W)
  noFill()
  stroke(255)
  frameRate(45)

  for (let x = 0; x < SPLIT; x++) {
    for (let y = 0; y < LAYER; y++) {
      items.push({
        initP: (x * TAU) / 3,
        radius: 40 * (y + 1),
        pm: y % 2 === 0 ? 1 : -1,
      })
    }
  }
}

function draw() {
  background(0, 20)
  translate(W / 2, W / 2)

  for (let item of items) {
    const { x, y, initP, radius, pm } = item
    ellipse(x, y, 30)
    item.x = radius * cos(pm * (t + initP))
    item.y = radius * sin(pm * (t + initP))
  }

  t += 0.06
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5)
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
