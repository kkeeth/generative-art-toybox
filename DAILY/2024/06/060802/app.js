let colors = [
  '#e6302b',
  '#fd7800',
  '#fbd400',
  '#51b72d',
  '#2abde4',
  '#5534eb',
  '#f477c3',
]
let SEED = Math.floor(Math.random() * 1000)

function setup() {
  createCanvas((W = windowHeight - 80), W)
  background(0)
  translate(W / 2, W / 2)

  for (let l = 0; l < W / 2; l += 1) {
    for (let a = 0; a < TAU; a += PI / 180) {
      let x = l * cos(a)
      let y = l * sin(a)
      let d = dist(0, 0, x, y)
      let n = noise(x / 100 + SEED, y / 100 + SEED)
      let c = colors[floor(n * colors.length)]
      stroke(c)
      strokeWeight(2)
      point(x, y)
    }
  }
}

function keyPressed() {
  if (key == 's') {
    saveCanvas('myCanvas', 'png')
  }
}
