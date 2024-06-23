function setup() {
  createCanvas(windowWidth, windowHeight)
  background(255)

  // 水面を描画
  drawWaterSurface()
}

function drawWaterSurface() {
  let lineCount = 300 // 描画する線の数
  let noiseScaleX = 0.1 // ノイズのスケール（X軸）
  let noiseScaleY = 0.1 // ノイズのスケール（Y軸）
  let maxOffset = 20 // 最大の左右のオフセット
  const span = width / lineCount

  noFill()
  for (let i = 0; i < width; i += span) {
    let startX = i
    let startY = 0

    stroke(random(120, 255), random(120, 255), random(120, 255))
    beginShape()
    for (let yy = startY; yy <= height; yy++) {
      let offsetX =
        noise(startX * noiseScaleX, yy * noiseScaleY) * maxOffset -
        maxOffset / 2
      vertex(startX + offsetX, yy)
    }
    endShape()
  }
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas('mySketch', 'jpg')
  }
}
