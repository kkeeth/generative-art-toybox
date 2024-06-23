function setup() {
  createCanvas((W = windowHeight - 50), W, WEBGL)
  rectMode(CENTER)
  background(0)
  stroke(255)
  noFill()
  for (let i = 0; i < 20; i++) {
    push()
    translate(random(-100, 100), random(-100, 100), random(-100, 100))
    rotateY(QUARTER_PI / 2)
    const x = random(50, W - 100)
    rect(0, 0, x, map(x, 50, W - 100, W, 50))
    pop()
  }

  filter(BLUR, 8)
  // filter(POSTERIZE, 2)
}
function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5)
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
