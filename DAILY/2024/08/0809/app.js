const NUM = 10
let minSide
let objs = []
let colors = ['#FFFFF', '#F7712D', '#FFEBEB', '#CCE5FA']

function setup() {
  createCanvas((W = min(windowWidth, windowHeight)), W, WEBGL)
  minSide = min(width / 2, height / 2)
  noFill()
  strokeWeight(1 / 2)
  frameRate(24)
  pixelDensity(2)

  for (let i = 0; i < NUM; i++) {
    addObjects()
  }
}

function draw() {
  background(0)
  orbitControl()
  push()
  rotateY(frameCount / 200)
  sphere(width)
  rotateY(frameCount * 0.0001)
  for (let i of objs) {
    i.run()
  }
  pop()

  for (let i = 0; i < objs.length; i++) {
    if (objs[i].isDead) {
      objs.splice(i, 1)
      addObjects(true)
    }
  }
}

function addObjects(isSingle = false) {
  let x = 0
  let y = 0
  let z = random(-width / 2, width / 2)
  let c = 0
  let num = int(random(10, 40))
  if (isSingle) {
    objs.push(new KRR(x, y, z, random(255), c))
  } else {
    for (let i = 0; i < num; i++) {
      objs.push(new KRR(x, y, z, random(255), c))
    }
  }
}

class KRR {
  constructor(x, y, z, r, c) {
    this.x = x
    this.y = y
    this.z = z
    this.c = c
    this.radius = 0
    this.maxRadius = minSide * 0.01 * random(0.02, 0.1)
    this.rStep = random(0.1, 0.4)
    this.maxCircleD = minSide * random(0.2, 0.01)
    this.circleD = this.maxCircleD
    this.ang = random(10)
    this.angStep = random([-1, 1]) * random(0.2, 0.05)
    this.drc = random(100)
    this.spd = random(5)
    this.life = 0
    this.lifeSpan = int(r / 5)

    this.pos = []
    this.pos.push(createVector(this.x, this.y, this.z))
    this.followers = colors.length
    this.cols = []
    for (let i = 0; i < colors.length; i++) {
      this.cols[i] = colors[i]
    }
  }

  show() {
    this.xx = this.x + this.radius * cos(this.ang)
    this.yy = this.y + this.radius * sin(this.ang)
    this.zz = this.z + this.radius * cos(this.ang)
    push()

    for (let i = 0; i < this.pos.length; i++) {
      stroke(this.cols[(this.c + i) % this.cols.length])
      push()
      translate(this.pos[i].x, this.pos[i].y, this.pos[i].z)
      rotateX(this.pos[i].x / 5)
      rotateY(this.pos[i].y / 5)
      rotateZ(this.pos[i].z / 5)
      box(this.circleD / 3)
      pop()
    }
    pop()
  }

  move() {
    this.ang += this.angStep
    this.x += this.spd * cos(this.drc)
    this.y += this.spd * sin(this.drc)
    this.z += this.spd * cos(this.drc)
    this.radius += this.rStep
    this.radius = constrain(this.radius, 0, this.maxRadius)
    this.life += 0.5
    this.isDead = false
    if (this.life > this.lifeSpan) {
      this.isDead = true
    }
    this.circleD = map(this.life, 0, this.lifeSpan, this.maxCircleD, 1)

    this.pos.push(createVector(this.xx, this.yy, this.zz))
    if (this.pos.length > this.followers) {
      this.pos.splice(0, 1)
    }
  }

  run() {
    this.show()
    this.move()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
