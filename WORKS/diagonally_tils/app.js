let wSpan;
let hSpan;

function setup() {
  createCanvas(h = 800, w = 600)
  const c = color(231, 208, 169)
  hSpan = h / 20
  wSpan = w / 45

  stroke(168, 168, 168)
  strokeWeight(1.5)
  for (let col = 0; col < h; col += hSpan) {
    for (let row = 0; row < w; row += wSpan * 2) {
      fill(c)
      rect(col, row, hSpan, wSpan)
      rotate(PI / 3.0)
      translate(hSpan / 2, wSpan / 2)
    }
  }

  strokeWeight(10.0)
  stroke(0)
  beginShape()
  vertex(35, 20)
  endShape()
}

function draw() {

}
