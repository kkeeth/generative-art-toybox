function setup() {
  createCanvas((W = windowHeight - 50), W)
  background(220)
  noLoop()
  noFill()
  strokeWeight((weight = 5))
  translate(W / 2, 0)

  drawTower()
}

function drawTower() {
  const margin = 10
  const topY = 50
  const radius = 30
  const firstBodyH = 200
  const firstBodyY = topY + radius
  const middle1W = 80
  const middle1H = 50
  const middle1Y = firstBodyY + firstBodyH
  const secondBodyH = 200
  const secondBodyY = middle1Y + middle1H
  const middle2W = 110
  const middle2H = 50
  const middle2Y = secondBodyY + secondBodyH

  // ICON
  ellipse(0, topY, radius)
  /**
   * TOP BODY
   */
  // left
  line(-radius / 2, firstBodyY, -(middle1W - 30), firstBodyY + firstBodyH)
  // right
  line(radius / 2, firstBodyY, middle1W - 30, firstBodyY + firstBodyH)

  // MIDDLE 1
  translate(0, 10)
  line(-middle1W, middle1Y, middle1W, middle1Y)
  line(
    -middle1W + weight,
    middle1Y + margin,
    -(middle1W - 16 + weight),
    middle1Y + middle1H - margin,
  )
  line(
    middle1W,
    middle1Y + margin,
    middle1W - 16 + margin,
    middle1Y + middle1H - margin,
  )
  line(
    -(middle1W - 16 + margin),
    middle1Y + middle1H,
    middle1W - 16 + margin,
    middle1Y + middle1H,
  )

  /**
   * MIDDLE BODY
   */
  // left
  translate(0, 10)
  line(
    -(middle1W - 24),
    secondBodyY,
    -(middle2W - 24),
    secondBodyY + secondBodyH,
  )

  // right
  line(middle1W - 24, secondBodyY, middle2W - 24, secondBodyY + secondBodyH)

  // MIDDLE 2
  translate(0, 10)
  line(-middle2W, middle2Y, middle2W, middle2Y)
  line(
    middle2W - 16,
    middle2Y + middle2H,
    -(middle2W - 16),
    middle2Y + middle2H,
  )

  /**
   *  BOTTOM BODY
   */
  translate(0, 10)
  // left
  line(-(middle2W - 24), middle2Y + middle2H, -1.5 * middle2W, W)

  // right
  line(middle2W - 24, middle2Y + middle2H, 1.5 * middle2W, W)
}

function draw() {
  // 空のdraw関数
}
