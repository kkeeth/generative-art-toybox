function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(240)
  // noFill()

  let offset = -width / 10
  let yStep = (height + offset * 2) / 5

  for (let y = offset; y <= height - offset; y += yStep) {
    let num = int(1 + 3 * noise(y / 100, frameCount / 100))
    // let arr = []
    // for (let i = 0; i < num; i++) {
    //   let n = sq(sq(noise(y / 10, frameCount / 200))) * (width - offset * 2)
    //   n = max(n, 1)
    //   arr.push(n)
    // }
    // drawingContext.setLineDash(arr)
    drawingContext.lineDashOffset = y - frameCount / 10
    // strokeWeight(yStep / 1.5)
    strokeCap(SQUARE)
    fill(100, 200, 100)
    // beginShape()
    beginShape(TESS)
    for (let x = offset; x < width - offset; x += 80) {
      let ny =
        y + sin(y / 330 + x / 300) * 150 * sin(frameCount / 60) * cos(y / 300)
      let nx = x
      /**
       * draw Y
       */
      vertex(nx + 10, ny + 10)
      vertex(nx + 30, ny + 10)
      vertex(nx + 50, ny + 40)
      vertex(nx + 70, ny + 10)
      vertex(nx + 90, ny + 10)
      vertex(nx + 60, ny + 55)
      vertex(nx + 60, ny + 90)
      vertex(nx + 40, ny + 90)
      vertex(nx + 40, ny + 55)
      // vertex(x, ny + 10)
    }
    endShape(CLOSE)
    // endShape()
  }
}
