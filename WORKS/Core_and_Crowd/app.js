let centerCircleRadius = 50;
const lineLength = 200;
const lengthBias = 150;
const edgeCircleRadius = 16;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  translate(width / 2, height / 2);
  background(240);
  randomSeed(0);
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;

  for (let theta = 0; theta < TWO_PI; theta += 0.09) {
    let diff = random() * lengthBias;
    let c = color(random() * 240, random() * 240, random() * 240);

    // for circles
    let x1 = (lineLength + diff) * cos(theta);
    let y1 = (lineLength + diff) * sin(theta);

    // for lines
    let x2 = (lineLength - edgeCircleRadius / 2 + diff) * cos(theta);
    let y2 = (lineLength - edgeCircleRadius / 2 + diff) * sin(theta);

    let diffX = abs(locX - x1);
    let diffY = abs(locY - y1);

    if (diffX < 80 && diffY < 20) {
      // for lines
      let mousePointDist = dist(0, 0, locX, locY);
      let dx2 = (mousePointDist - dist(locX, locY, x1, y1)) * cos(theta);
      let dy2 = (mousePointDist - dist(locX, locY, x1, y1)) * sin(theta);

      line(locX, locY, 0, 0);

      // edge circle
      push();
      noStroke();
      fill(c);
      circle(locX, locY, dist(x1, y1, locX, locY));
      pop();
    } else {
      line(x2, y2, 0, 0);

      // edge circle
      push();
      noStroke();
      fill(c);
      circle(x1, y1, edgeCircleRadius);
      pop();
    }
  }

  // center circle
  push();
  fill(20);
  stroke(255);
  circle(0, 0, centerCircleRadius);
  pop();
}
