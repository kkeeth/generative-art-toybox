const NUM = 200
let items = []
let v

function setup() {
  createCanvas(600, 600, WEBGL)
  // fill('violet')
  stroke(255)

  for (let i = 0; i < NUM; i++) {
    v = p5.Vector.random3D()

    items.push({
      x: 200 * v.x,
      y: 200 * v.y,
      z: 200 * v.z,
      size: random(2, 4),
    })
  }
}

function draw() {
  background(0)
  orbitControl()
  lights()

  rotateX(frameCount * 0.01)
  rotateY(frameCount * 0.03)

  for (let i = 0; i < NUM; i++) {
    push()
    noStroke()
    translate(items[i].x, items[i].y, items[i].z)
    sphere(items[i].size)
    pop()
    for (let j = 0; j < NUM; j++) {
      if (
        i + 1 !== NUM &&
        dist(
          items[i].x,
          items[i].y,
          items[i].z,
          items[j].x,
          items[j].y,
          items[j].z,
        ) < 80
      ) {
        line(
          items[i].x,
          items[i].y,
          items[i].z,
          items[j].x,
          items[j].y,
          items[j].z,
        )
      }
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
