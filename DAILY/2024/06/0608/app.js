function setup() {
  createCanvas((W = windowHeight - 50), W)
  noFill()
  background(0)
  strokeWeight(3)
  rectMode(CENTER)
  textSize(44)
  textAlign(CENTER, CENTER)

  const padding = 40
  const count = 6
  const span = (W - padding) / count

  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      push()
      stroke(random(120, 255), random(120, 255), random(120, 255))
      translate(
        x * span + span / 2 + padding / 2,
        y * span + span / 2 + padding / 2,
      )
      rotate(random(TAU))
      drawShovelIcon(0, 0, W / 22, W / 20)
      translate(0, 52)
      // text('🍛', 0, 0)
      pop()
    }
  }
}

function drawShovelIcon(x, y, w, h) {
  // ハンドル
  beginShape()
  vertex(x - w / 3, y - h * 0.9)
  vertex(x - w / 4, y - h * 0.6)
  vertex(x + w / 4, y - h * 0.6)
  vertex(x + w / 3, y - h * 0.9)
  vertex(x - w / 3, y - h * 0.9)
  endShape()

  // シャフト
  line(x, y - h * 0.6, x, y + h * 0.4)

  // ブレード
  beginShape()
  vertex(x - w / 2, y + h * 0.2)
  bezierVertex(
    x - w / 2,
    y + h * 1.2,
    x + w / 2,
    y + h * 1.2,
    x + w / 2,
    y + h * 0.2,
  )
  endShape()
  line(x - w / 2, y + h * 0.2, x, y + h * 0.4)
  line(x + w / 2, y + h * 0.2, x, y + h * 0.4)
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
