let w, h, block_w, block_h
let colors = ["#FFF", "#FF0000", "#E4E7EB", "#667992", "#272B34", "#000"]

function setup() {
  createCanvas(w = 600, h = 600)
  background(255)
  noStroke()

  block_w = w / 10
  block_h = h / 10

  for (let i = 0; i < w; i += block_w) {
    for (let j = 0; j < h; j += block_h) {
      fill(random(colors))
      triangle(i, j + block_h, i, j, i + block_w, j)
      fill(random(colors))
      triangle(i, j + block_h, i + block_w, j, i + block_w, j + block_h)
    }
  }
}
