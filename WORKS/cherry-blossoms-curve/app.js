/**
 * I refer to the functions in the following article
 *
 * ulim=0.8;
 * h(x):=if(x<ulim,0,ulim-x);
 * r0(x):=(-1)^mod(floor(n/pi*x),2)*(n/pi*x-floor(n/pi*x))+mod(floor(n/pi*x),2);
 * r(x):=r0(x)+2*h(r0(x));
 *
 * URL: https://sites.google.com/site/cinderellajapan/huanocg/huano-qu-xian
 */

const ulim = 0.8
const petals = []
const petalNumer = 50

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  noStroke()
  for (let i = 0; i < petalNumer; i++) {
    petals.push(new CherryBlossom())
  }
}

function draw() {
  background(20)
  for (let i = 0; i < petalNumer; i++) {
    petals[i].update()
    petals[i].render()
  }
}

class CherryBlossom {
  constructor() {
    this.petalNumber = 4
    this.petalSize = random(30, 70)

    // color settings
    this.r = floor(random(245, 255))
    this.g = 219
    this.b = 237
    this.alpha = random(0.7, 1)

    // moving petals
    this.xBase = random(width)
    this.xRadius = random(50, 100)
    this.xTheta = random(360)
    this.xaVelocity = random(1, 2)

    this.vecLocation = createVector(this.xBase, random(height))
    this.yVelocity = this.petalSize / 30
  }

  /**
   * calculate each processings
   */
  update() {
    // moving range with X base value
    this.vecLocation.x = this.xBase + this.xRadius * sin(radians(this.xTheta))

    // from angle velocity to angle
    this.xTheta += this.xaVelocity

    // fall from top to bottom
    this.vecLocation.y += this.yVelocity
    if (this.vecLocation.y > height) this.vecLocation.y = -this.petalSize
  }

  /**
   * h(x):=if(x<ulim,0,ulim-x);
   *
   * @param {number} x angle(radians)
   */
  calculateH(x) {
    if (x < ulim) return 0
    else return ulim - x
  }

  render() {
    fill(`rgba(${this.r}, ${this.g} , ${this.b}, ${this.alpha})`)

    push()
    translate(this.vecLocation.x - width / 2, this.vecLocation.y - height / 2)
    rotateX(radians(this.xTheta))
    rotateY(radians(this.xTheta))
    lights()
    beginShape()

    for (let theta = 0; theta < TWO_PI / this.petalNumber; theta += 0.01) {
      // n/pi*x
      const A = (this.petalNumber / PI) * theta
      // mod(floor(n/pi*x),2)
      const mod = floor(A) % 2
      // r0(x):=(-1)^mod(floor(n/pi*x),2)*(n/pi*x-floor(n/pi*x))+mod(floor(n/pi*x),2);
      const r0 = pow(-1, mod) * (A - floor(A)) + mod
      // r(x):=r0(x)+2*h(r0(x));
      const r = r0 + 2 * this.calculateH(r0)

      let x = this.petalSize * r * cos(theta)
      let y = this.petalSize * r * sin(theta)

      vertex(x, y)
    }

    endShape(CLOSE)
    pop()
  }
}
