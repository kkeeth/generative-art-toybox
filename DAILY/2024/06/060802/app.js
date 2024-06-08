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
let t = 0

function setup() {
  createCanvas((W = windowHeight - 80), W)
}

function draw() {
  background(0)
  translate(W / 2, W / 2)

  for (let l = 0; l < W / 2.5; l += 3) {
    for (let a = 0; a < TAU; a += PI / 240) {
      let x = l * cos(a)
      let y = l * sin(a)
      let n = noise(x / 100 + SEED + t / 99, y / 100 + SEED + t / 77)
      let c = colors[floor(n * colors.length)]
      stroke(c)
      strokeWeight(2)
      point(x, y)
    }
  }
  t++
}

function keyPressed() {
  if (key === 's') {
    saveGif('myGif', 5)
  }

  if (key == 'c') {
    saveCanvas('myCanvas', 'png')
  }
}
