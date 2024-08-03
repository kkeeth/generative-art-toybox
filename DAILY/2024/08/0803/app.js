let fireworks = []
let gravity
let hanabiImage

function preload() {
  hanabiImage = loadImage('hanabi.jpeg')
  hanabiImage.loadPixels()
}

function setup() {
  createCanvas(hanabiImage.width, hanabiImage.height)
  gravity = createVector(0.0, 0.2)
  imageMode(CENTER)
}

function draw() {
  background(0, 8)

  if (random(1) < 0.2) {
    fireworks.push(new Firework())
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update()
    fireworks[i].show()
    if (fireworks[i].done()) {
      fireworks.splice(i, 1)
    }
  }
}

class Firework {
  constructor() {
    this.firework = new Particle(
      random(width),
      random(height / 8, height),
      true,
    )
    this.exploded = false
    this.particles = []
  }

  done() {
    return this.exploded && this.particles.length === 0
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity)
      this.firework.update()

      if (this.firework.vel.y >= 0) {
        this.exploded = true
        this.explode()
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity)
      this.particles[i].update()
      if (this.particles[i].done()) {
        this.particles.splice(i, 1)
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false)
      this.particles.push(p)
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show()
    }

    for (let particle of this.particles) {
      particle.show()
    }
  }
}

class Particle {
  constructor(x, y, firework) {
    this.pos = createVector(x, y)
    this.firework = firework
    this.lifespan = 255
    this.vel = firework
      ? createVector(0, random(-10, -7))
      : p5.Vector.random2D().mult(random(5, 12))
    this.acc = createVector(0, 0)
    this.hu = random(255)
  }

  applyForce(force) {
    this.acc.add(force)
  }

  update() {
    if (!this.firework) {
      this.vel.mult(random(0.95, 0.98))
      this.lifespan -= 4
    }

    this.vel.add(this.acc)
    this.pos.add(this.vel)
    this.acc.mult(0)
  }

  done() {
    return this.lifespan < 0
  }

  show() {
    if (!this.firework) {
      strokeWeight(map(this.pos.y, 0, height, 4, 0.5))
    } else {
      strokeWeight(map(this.pos.y, height, 0, 4, 0.5))
    }
    let c = hanabiImage.get(this.pos.x, this.pos.y)
    stroke(c)
    point(this.pos.x, this.pos.y)
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 5)
    // saveFrames('mySketch', 'png', 5, 25)
  }
}
