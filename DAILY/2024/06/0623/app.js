let seed
let xiff = 0

function setup() {
  createCanvas(windowWidth, windowHeight)
  noStroke()
  noLoop()
  seed = random(1000)
}

function draw() {
  background(255)
  randomSeed(seed)

  // 水面を描画
  drawWaterSurface()
}

function drawWaterSurface() {
  let lineCount = 6 // 描画する線の数
  let noiseScaleX = 0.1 // ノイズのスケール（X軸）
  let noiseScaleY = 0.1 // ノイズのスケール（Y軸）
  let maxOffset = 100 // 最大の上下のオフセット
  const span = height / lineCount

  noFill()
  for (let i = 0; i < height; i += span) {
    let startX = 0
    let startY = i + 50

    fill(random(120, 255), random(120, 255), random(120, 255))
    beginShape()
    for (let xx = startX; xx <= width + span; xx += 10) {
      let offsetY =
        noise(startY * noiseScaleX, xx * noiseScaleY) * maxOffset -
        maxOffset / 2
      vertex(
        xx + xiff > width ? xx + xiff - width : xx + xiff,
        startY + offsetY,
      )
    }
    vertex(width, height)
    vertex(0, height)
    endShape()
  }
  xiff++
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas('mySketch', 'jpg')
  }
}
