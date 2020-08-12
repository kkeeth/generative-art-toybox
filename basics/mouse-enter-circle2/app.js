let isNoMove = true
function setup() {
  createCanvas(640, 480);
  smooth();
  ellipse(320, 240, 50, 50);
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
    ellipse(mouseX, mouseY, 50, 50)
  }
}

function mouseMoved() {
  isNoMove = false
}
