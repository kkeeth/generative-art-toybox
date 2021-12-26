let t = 0

function setup() {
  createCanvas(windowWidth, W = windowHeight, WEBGL)
}

function draw() {
  background(0)

  rotateY(t * 0.1)
  translate(0, -W / 2)

  for (let i = 0; i < W; i += 2) {
    // logarithmic spiral
    // x = r * cos(variable)
    // y = r * sin(variable)
    v = i / 12
    x = 220 * cos(i)
    z = 220 * sin(i)
    q = 100 * sin(i / 33 + t) + 155

    // SPIRAL DOTS
    // increase the size of the dots as you go up
    // strokeWeight(int((W - i) / 40))
		strokeWeight(20)
    stroke(q, i % 255, i % 200)
    point(x, i / 0.5, z)
  }
  t += .05
}
