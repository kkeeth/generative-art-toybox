let g
const cp = ['#FB8C0099', '#82B1FF99', '#21212199']

function setup() {
  createCanvas((W = min(windowWidth, windowHeight)), W)
  background(255)
  // rectMode(CENTER)

  g = W / 4

  for (let x = g / 2; x < width; x += g) {
    for (let y = g / 2; y < height; y += g) {
      const isOrval = random() > 0.5
      let isBlack

      drawEar(x, y, isOrval, g)
      if (isOrval) {
        push()
        if (random() > 0.7) {
          fill(0)
          isBlack = true
        }
        ellipse(x, y, g / 1.5, g / 2.2)
        pop()
      } else {
        push()
        if (random() > 0.7) {
          fill(0)
          isBlack = true
        }
        ellipse(x, y, g / 1.6, g / 2)
        pop()
      }
      drawMarking(x, y, isOrval)
      drawEye(x, y, isOrval, isBlack)
      drawMouth(x, y, g, isBlack)
      drawWhisker(x, y, g)
    }
  }
}

function drawEar(x, y, isOrval, g, isBlack) {
  if (isOrval) {
    bezier(
      x - g / 4.5,
      y - g / 6,
      x - g / 6.5,
      y - g / 3,
      x - g / 6.5,
      y - g / 3,
      x - g / 10.5,
      y - g / 5,
    )
    bezier(
      x + g / 4.5,
      y - g / 6,
      x + g / 7.5,
      y - g / 3,
      x + g / 7.5,
      y - g / 3,
      x + g / 10.5,
      y - g / 5,
    )
  } else {
    bezier(
      x - g / 5,
      y - g / 8,
      x - g / 5.5,
      y - g / 3,
      x - g / 6,
      y - g / 3.5,
      x - g / 12,
      y - g / 5,
    )
    bezier(
      x + g / 5,
      y - g / 8,
      x + g / 5.5,
      y - g / 3,
      x + g / 6,
      y - g / 3.5,
      x + g / 12,
      y - g / 5,
    )
  }
}

function drawMouth(x, y, g, isBlack) {
  if (random() > 0.1) {
    const uy = y + random([g / 12, g / 6.5])
    push()
    fill(isBlack ? 255 : 0)
    ellipse(x, uy, random([5, 8]))
    pop()

    push()
    noFill()
    isBlack && stroke(255)
    bezier(
      x,
      uy + 3,
      x - 5,
      uy + g / 10.5,
      x - 9,
      uy + g / 10.5,
      x - 14,
      uy + g / 12,
    )
    bezier(
      x,
      uy + 3,
      x + 5,
      uy + g / 10.5,
      x + 9,
      uy + g / 10.5,
      x + 14,
      uy + g / 12,
    )
    pop()
  }
}

function drawWhisker(x, y, g) {
  const pattern = random([
    'two-straight',
    'three-straight',
    'two-curve',
    'three-curve',
  ])

  switch (pattern) {
    case 'two-straight':
      line(x - g / 6.5, y + g / 8, x - g / 3.2, y + g / 8)
      line(x - g / 6.5, y + g / 6, x - g / 3.5, y + g / 5.5)
      line(x + g / 6.5, y + g / 8, x + g / 3.2, y + g / 8)
      line(x + g / 6.5, y + g / 6, x + g / 3.5, y + g / 5.5)
      break
    case 'three-straight':
      line(x - g / 6.5, y + g / 8, x - g / 3.2, y + g / 8)
      line(x - g / 6.5, y + g / 6.5, x - g / 3.3, y + g / 6)
      line(x - g / 6.5, y + g / 5.5, x - g / 3.5, y + g / 4.5)
      line(x + g / 6.5, y + g / 8, x + g / 3.2, y + g / 8)
      line(x + g / 6.5, y + g / 6.5, x + g / 3.3, y + g / 6)
      line(x + g / 6.5, y + g / 5.5, x + g / 3.5, y + g / 4.5)
      break
    case 'two-curve':
      break
    case 'three-curve':
      break
  }
}

function drawEye(x, y, isOrval, isBlack) {
  const eyeBrowPattern = random(['level', 'curve', 'tilt'])
  const eyeFramePattern = random() > 0.5 ? random(['circle', 'orval']) : false
  const eyePattern =
    eyeFramePattern === 'orval'
      ? random(['vertical', 'point', 'dot', 'stroke'])
      : eyeFramePattern === 'circle'
      ? random(['point', 'dot'])
      : random(['line', 'dot'])
  const eyeDirection =
    eyeFramePattern === false
      ? 'front'
      : eyeFramePattern === 'orval'
      ? random(['left', 'right', 'front'])
      : random(['up', 'down', 'left', 'right', 'front'])
  let ux = 0
  let uy = 0

  push()
  translate(0, isOrval ? 0 : -g / 20)

  if (eyeFramePattern === 'circle') {
    ellipse(x - g / 7, y, 20)
    ellipse(x + g / 7, y, 20)
    switch (eyeDirection) {
      case 'up':
        uy = -3
        break
      case 'down':
        uy = 3
        break
      case 'left':
        ux = -3
        break
      case 'right':
        ux = 3
        break
    }
  } else if (eyeFramePattern === 'orval') {
    ellipse(x - g / 7, y, 24, 16)
    ellipse(x + g / 7, y, 24, 16)
    switch (eyeDirection) {
      case 'up':
        uy = -5
        break
      case 'down':
        uy = 5
        break
      case 'left':
        ux = -5
        break
      case 'right':
        ux = 5
        break
    }
  }

  switch (eyePattern) {
    case 'vertical':
      push()
      fill(0)
      ellipse(x - g / 7, y, 8, 16)
      ellipse(x + g / 7, y, 8, 16)
      pop()
      break
    case 'point':
      push()
      strokeWeight(8)
      point(x - g / 7 + ux, y + uy)
      point(x + g / 7 + ux, y + uy)
      pop()
      break
    case 'stroke':
      push()
      strokeWeight(4)
      isBlack && stroke(255)
      ellipse(x - g / 7 + ux, y, 10)
      ellipse(x + g / 7 + ux, y, 10)
      pop()
      break
    case 'line':
      isBlack && stroke(255)
      line(x - g / 5, y, x - g / 12, y)
      line(x + g / 5, y, x + g / 12, y)
      break
    case 'dot':
      push()
      strokeWeight(4)
      if (isBlack && eyeFramePattern === false) stroke(255)
      point(x - g / 7, y)
      point(x + g / 7, y)
      pop()

      // eyebrow
      if (eyeFramePattern === false) {
        isBlack && stroke(255)
        switch (eyeBrowPattern) {
          case 'level':
            line(x - g / 5, y - 8, x - g / 9, y - 8)
            line(x + g / 5, y - 8, x + g / 9, y - 8)
            break
          case 'curve':
            push()
            noFill()
            bezier(
              x - g / 5,
              y - 8,
              x - g / 6.5,
              y - 12,
              x - g / 6.5,
              y - 12,
              x - g / 9,
              y - 8,
            )
            bezier(
              x + g / 5,
              y - 8,
              x + g / 6.5,
              y - 12,
              x + g / 6.5,
              y - 12,
              x + g / 9,
              y - 8,
            )
            pop()
            break
          case 'tilt':
            line(x - g / 5, y - 10, x - g / 9, y - 8)
            line(x + g / 5, y - 10, x + g / 9, y - 8)
            break
        }
      }

      break
  }
  pop()
}

function drawMarking(x, y, isOrval) {
  push()
  fill(random(cp))
  noStroke()
  if (isOrval) {
    random() > 0.5
      ? rect(x - g / 3, y - g / 4, g / 3, g / 3, g / 4.5, 20, g / 6, 24)
      : rect(x, y - g / 4, g / 3, g / 3, 20, g / 4.5, 24, g / 6)
  } else {
    random() > 0.7 && ellipse(x, y - g / 5.5, g / 6, g / 7)
  }
  pop()
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}
