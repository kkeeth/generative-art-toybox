const NUM = 9
const drops = []
const COUNT = 50
const R = 80

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
      }),
    )
  }
}

function draw() {
  background(240)
  lights()
  orbitControl()

  for (let drop of drops) {
    drop.update()
    drop.show()
  }
}

class Drop {
  constructor({ x, y, z, size, speed }) {
    this.x = x
    this.y = y
    this.z = z
    this.speed = speed
    this.size = size
  }

  update() {
    this.y += this.speed

    if (this.y > W / 2.5) this.y = -W / 2.5
  }

  show() {
    noStroke()
    fill('#3399FF')
    for (let i = 0; i < this.size; i++) {
      push()
      push()
      stroke(0)
      line(this.x, -W / 2, this.z, this.x, W / 2, this.z)
      pop()
      translate(this.x, this.y + i * 1.5, this.z)
      sphere(i)
      pop()
    }
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
