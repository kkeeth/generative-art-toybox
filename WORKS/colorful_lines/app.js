const colors = ["#248888", "#E6E6E6", "#E7475E", "#F0D879"]
const baseWidth = 20
const lines = []
const velocity = 1

function setup() {
  createCanvas(700, 600)
  strokeWeight(baseWidth)
  background(200)

  for (let y = 100; y < height - 100; y += 30) {
    push()
    const startPoint = int(random(-baseWidth, baseWidth))
    const len = int(random(baseWidth, width / 4))
    drawLine(startPoint, y, len)
    pop()
  }
}

function drawLine(x, y, lineLength) {
  stroke(random(colors))
  line(x, y, lineLength, y)

  if (lineLength < width) {
    const len = int(random(baseWidth, width / 4))
    drawLine(lineLength + 50, y, lineLength + len)
  }
}

// class Line {
//   constructor(y) {
//     this.y = y
//     this.color = random(colors)
//     this.startPosition = int(random(-baseWidth, baseWidth))
//     this.endPosition = int(random(baseWidth, width / 4))
//   }

//   drawLines() {
//     stroke(this.color)
//     line(this.startPosition, this.y, this.endPosition, this.y)
//     this.startPosition += velocity
//     this.endPosition += velocity

//     if (this.startPosition > baseWidth) {
//       this.startPosition = int(random(-baseWidth, baseWidth))
//       this.endPosition = int(random(baseWidth, width / 4)
//     }
//   }
// }