const cp = [
  '#F5EAEA',
  '#FFB84C',
  '#F16767',
  '#A459D1',
  '#4D455D',
  '#E96479',
  '#F5E9CF',
  '#7DB9B6',
]
let isNight = false
let x, y

function setup() {
  createCanvas((W = windowHeight - 100), W)
  angleMode(DEGREES)
  rectMode(CENTER)
  noStroke()
}

function draw() {
  clear()
  background(isNight ? 50 : 255)
  dividedRect(20, 20, width - 40, height - 40, 6)
  noLoop()
}

function dividedRect(x, y, w, h, n) {
  if (n > 0) {
    n--
    if (w >= h) {
      let rndw = random(0.4, 0.9) * w
      dividedRect(x, y, rndw, h, n)
      dividedRect(x + rndw, y, w - rndw, h, n)
    }
    if (w < h) {
      let rndh = random(0.4, 0.9) * h
      dividedRect(x, y, w, rndh, n)
      dividedRect(x, y + rndh, w, h - rndh, n)
    }
  } else {
    fill(random(cp))
    // rect(x + w / 2, y + h / 2, w - 5, h - 5)
    push()
    drawUmbrella(x + w / 2, y + h / 2, random(cp), w / W, h / W)
    pop()
  }
}

function drawUmbrella(initX, initY, c, w, h) {
  translate(initX, initY)
  scale(w * 3, h * 3)
  translate(0, 40 * h)

  push()
  fill(isNight ? 255 : c)
  noStroke()
  beginShape()
  for (let i = 180; i < 360; i += 6) {
    x = 100 * cos(i)
    y = 90 * sin(i)
    vertex(x, y)
  }
  for (let j = 100; j > -100; j -= 40) {
    for (let i = 360; i > 180; i -= 6) {
      x = j - 20 + 20 * cos(i)
      y = 20 * sin(i)
      vertex(x, y)
    }
  }
  endShape(CLOSE)
  pop()

  push()
  stroke(isNight ? width : c)
  strokeWeight(4)
  // draw stick
  line(0, -110, 0, 50)

  // draw handle
  noFill()
  arc(-7.5, 50, 15, 20, 0, 180)
  pop()

  translate(-initX, -initY)
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas('mySketch', 'jpeg')
  }
}

function mousePressed() {
  isNight = !isNight
  redraw()
}
