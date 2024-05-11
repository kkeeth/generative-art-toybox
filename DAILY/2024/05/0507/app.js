const step = 12
const arr = []
let mx, my

function setup() {
  createCanvas((W = windowHeight - 50), W)
  for (let x = step / 2; x < width; x += step) {
    arr.push({
      x: x,
      y: random(height),
      velocity: random(5, 8),
    })
  }
}

function draw() {
  background(255)

  for (let x = step / 2; x < width; x += step) {
    line(x, 0, x, height)
  }

  push()
  fill(0)
  for (let item of arr) {
    ellipse(item.x, item.y, 20 - map(item.y, 0, height, 0, 20))
    item.y += item.velocity

    if (item.y > height) {
      item.y = -step
    }
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 5)
  }

  if (key === 'c') {
    saveCanvas('mySketch', 'jpeg')
  }
}
