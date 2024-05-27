let seed
let colors

function setup() {
  createCanvas((W = windowHeight - 50), W)
  strokeWeight(5)
  strokeCap(ROUND)
  stroke('#fff')
  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  textSize(48)

  seed = random(1000)
  colors = [
    color(179, 205, 216),
    color(153, 190, 203),
    color(143, 181, 197),
    color(140, 178, 192),
    color(132, 172, 190),
    color(132, 165, 172),
  ]
}

function draw() {
  background(212, 229, 233)
  randomSeed(seed)

  push()
  fill('#fff')
  text("My Podcast's Title !!", width / 2, 160)
  pop()

  for (let i = 0; i < colors.length; i++) {
    drawBackgroundWaves(colors[i], height / 2 + i * 50, 100 + i * 50)
  }
  drawWaveForm()
  drawMike()
  drawHeadphone()
  drawSoundWave()
}

function drawBackgroundWaves(col, yOffset, amplitude) {
  push()
  fill(col)
  noStroke()
  beginShape()
  let xOff = 0
  for (let x = 0; x <= width; x += 2) {
    let y = yOffset + noise(xOff, yOffset * 0.1) * amplitude
    curveVertex(x, y)
    xOff += 0.02
  }
  vertex(width, height)
  vertex(0, height)
  endShape(CLOSE)
  pop()
}

function drawHeadphone() {
  push()
  translate(W / 2, W / 2.1)
  noFill()
  stroke(131, 175, 191)
  strokeWeight(16)

  beginShape()
  for (let i = PI; i < TAU; i += 0.1) {
    vertex(120 * cos(i), 110 * sin(i))
  }
  endShape()

  strokeWeight(28)
  line(115, 0, 115, 60)
  line(-115, 0, -115, 60)
  strokeWeight(20)
  line(145, 10, 145, 50)
  line(-145, 10, -145, 50)
  pop()
}

function drawWaveForm() {
  push()
  translate(0, W / 2)
  for (let i = 0; i < width; i += 10) {
    line(
      i,
      160 * (noise(i / 100, frameCount / 100) * 2 - 1),
      i,
      -160 * (noise(i / 100, frameCount / 100) * 2 - 1),
    )
  }
  pop()
}

function drawMike() {
  push()
  translate(W / 2, W / 1.8)
  noStroke()

  // body
  push()
  drawingContext.shadowColor = colors[2]
  drawingContext.shadowBlur = 20
  fill('#fff')
  arc(0, -50, 160, 160, PI, TAU, CHORD)
  arc(0, 50, 160, 160, 0, PI, CHORD)
  pop()
  rect(0, 0, 160, 100)

  rectMode(CORNER)
  noStroke()
  fill(131, 175, 191)

  // First row
  rect(-80, -45, 55, 15)
  ellipse(-25, -37.5, 15)

  rect(25, -45, 55, 15)
  ellipse(25, -37.5, 15)

  // Second row
  rect(-80, -15, 55, 15)
  ellipse(-25, -7.5, 15)

  rect(25, -15, 55, 15)
  ellipse(25, -7.5, 15)

  // Third row
  rect(-80, 15, 55, 15)
  ellipse(-25, 22.5, 15)

  rect(25, 15, 55, 15)
  ellipse(25, 22.5, 15)

  // Base
  push()
  translate(0, 50)
  noFill()
  stroke('#fff')
  strokeWeight(20)
  beginShape()
  vertex(-110, -20)
  vertex(-110, 0)
  for (let i = PI; i > 0; i -= 0.1) {
    vertex(110 * cos(i), 110 * sin(i))
  }
  vertex(110, 0)
  vertex(110, -20)
  endShape()

  line(0, 110, 0, 240)
  drawingContext.shadowOffsetY = 12
  drawingContext.shadowColor = '#ededed'
  drawingContext.shadowBlur = 12
  line(-80, 240, 80, 240)
  pop()
  pop()
}

function drawSoundWave() {
  push()
  translate(width / 2, height / 1.5)
  noFill()
  strokeWeight(10)

  for (let i = 1; i <= 3; i++) {
    arc(-140 - i * 20, 0, 65 * i, 80 * i, 2 * QUARTER_PI, 4 * QUARTER_PI)
    arc(140 + i * 20, 0, 65 * i, 80 * i, 0, 2 * QUARTER_PI)
  }
  pop()
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5)
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
