let isNoMove = true;
let r = 50;

function setup() {
  createCanvas(640, 480);
  smooth();
}

function draw() {
  background('skyblue');
  noStroke();

  if (isNoMove) {
    ellipse(width/2, height/2, 50, 50);
    return;
  }
  else {
    if (mouseIsPressed) {
      fill('pink')
    }
    else {
      fill('#fff')
    }
    ellipse(mouseX, mouseY, r, r)
  }
}

function mouseMoved() {
  isNoMove = false
}

function mousePressed() {
  r += 10;
  return;
}
