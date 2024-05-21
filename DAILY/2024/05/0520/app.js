const NUM = 21
const drops = []
const COUNT = 50
const R = 100

function setup() {
  createCanvas((W = windowHeight - 100), W, WEBGL)

  for (let i = 0; i < COUNT; i++) {
    drops.push(
      new Drop({
        x: R * sin(map(i % NUM, 0, NUM, 0, TAU)),
        y: random(-W / 2, W / 2),
        z: R * cos(map(i % NUM, 0, NUM, 0, TAU)),
        size: random(3, 6),
        speed: random(1, 5),
        alpha: map(R * cos(map(i % NUM, 0, NUM, 0, TAU)), -R, R, 128, 255),
      }),
    )
  }
}

function draw() {
  background(255)
  // lights()
  orbitControl()

  for (let drop of drops) {
    drop.update()
    drop.show()
  }
}

class Drop {
  constructor({ x, y, z, size, speed, alpha }) {
    this.x = x
    this.y = y
    this.z = z
    this.speed = speed
    this.size = size
    this.alpha = alpha
  }

  update() {
    this.y += this.speed

    if (this.y > W / 2.5) this.y = -W / 2.5
  }

  show() {
    noStroke()
    for (let i = 0; i < this.size; i++) {
      push()
      push()
      stroke(0)
      line(this.x, -W / 2, this.z, this.x, W / 2, this.z)
      pop()
      const c = color('#3399FF')
      c.setAlpha(this.alpha)
      fill(c)
      translate(this.x, this.y + i * 1.5, this.z)
      sphere(i)
      pop()
    }
    push()
    fill(220)
    translate(0, -W / 2, 0)
    cylinder(R, 1)
    translate(0, W, 0)
    cylinder(R, 1)
    pop()
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5)
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
