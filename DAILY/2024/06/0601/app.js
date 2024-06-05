function setup() {
  createCanvas((W = windowHeight - 50), W)
  background(40)
  translate(width / 2, height - 40)

  fill(240)
  stroke(240)
  strokeCap(SQUARE)

  const base = height - 100
  const span = base / 6

  // tree-trunk
  quad(-20, 4, 20, 20, 3, -base + 20, -3, -base + 20)
  // branch
  push()
  strokeWeight(8)

  for (let i = 0; i < 5; i++) {
    translate(0, -span)
    let x = i < 4 ? -270 + i * 45 : -54
    let y = x * (3 / 5)
    // left-bottom
    line(0, 0, x, y)
    // light-bottom
    line(0, 0, -x, y)

    x = i < 4 ? -162 + i * 45 : -54
    y = x * (3 / 5)
    // left-top
    line(x, y, x, y)
    // light-top
    line(0, 0, -x, y)
  }

  push()
  strokeWeight(5)
  for (let j = 0; j < 200; j++) {
    fill(random(120, 220), random(120, 220), random(120, 220))
    const y = random(-span + 30, W / 1.8)
    const xSpan = sin(map(y, -span - 20, W / 2, 0, PI))
    ellipse(random(200, 350) * random(-xSpan, xSpan), y, random(16, 40))
  }
  pop()

  pop()

  // filter(POSTERIZE, 9)
}

function keyPressed() {
  if (key === 's') {
    saveCanvas('mySketch', 'jpeg')
  }
}
