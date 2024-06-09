const N = 5
const colors = ['#ED6A5A', '#F4F1BB', '#9BC1BC', '#5CA4A9', '#E6EBE0']
let span

function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)
  noLoop()
  noStroke()

  span = min(width, height) / N

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      drawPerson(i, j)
    }
  }
}

function drawPerson(x, y) {
  x = span * x + span / 2 + random(-span / 2, span / 2)
  y = span * y + span / 2 + random(-span / 2, span / 2)

  // head
  const headW = 12
  fill(0)
  ellipse(x, y, headW)

  // body
  push()
  translate(-headW, headW / 2)
  fill(random(colors))
  rect(x, y, headW * 2, headW * 4, random(2, 8))
  pop()

  push()
  stroke(0)
  strokeWeight(3)

  // hands
  line(
    x - headW,
    y + headW + 10,
    x - headW - 10,
    random() > 0.5 ? y + headW + 20 : y + headW - 10,
  )
  line(
    x + headW,
    y + headW + 10,
    x + headW + 10,
    random() > 0.5 ? y + headW + 20 : y + headW - 10,
  )

  // one's feet shadow
  push()
  rectMode(CENTER)
  stroke(120)
  fill(120)
  ellipse(x, y + headW * 6, headW * 2.5, headW)
  pop()

  // shadows created by the sun
  push()
  const c1 = color(255)
  const c2 = color(120)
  translate(x - 4, y + headW * 6)
  rotate(-PI / 12)
  for (let i = 0; i > -headW * 5; i--) {
    const inter = map(i, -headW * 5, 0, 0, 1)
    let c = lerpColor(c1, c2, inter)
    stroke(c)
    const h = map(inter, 0, 1, 0, headW * 0.53)
    line(i, -h, i, h)
  }
  pop()

  // legs
  stroke(0)
  line(
    x - headW / 3,
    y + headW * 4.5,
    random() > 0.5 ? x - headW / 2 : x - headW / 3,
    y + headW * 6,
  )
  line(
    x + headW / 3,
    y + headW * 4.5,
    random() > 0.5 ? x + headW / 2 : x + headW / 3,
    y + headW * 6,
  )

  pop()
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas('mySketch', 'jpeg')
  }
}
