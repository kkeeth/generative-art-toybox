let initialAngle;

function setup() {
  createCanvas(700, 700);

  initialAngle = random(TAU);
}

function draw() {
  background(0);

  // whole display rotating
  translate(width / 2, height / 2);
  rotate(frameCount / 100);

  // center inner
  ellipse(0, 0, 80);

  push();
  stroke(255);
  strokeWeight(2);
  noFill();
  // center outer
  ellipse(0, 0, 100);
  pop();

  // arround circles
  for (let i = 0; i < 3; i++) {
    let angle = initialAngle + (TAU / 3) * i;
    let x = cos(angle) * 210;
    let y = sin(angle) * 210;
    ellipse(x, y, 30);

    push();
    stroke(255);
    strokeWeight(2);
    noFill();
    ellipse(x, y, 40);

    push();
    stroke(255, 120);
    ellipse(x, y, 200);
    pop();
    line(0, 0, x, y);
    strokeWeight(8);
    beginShape();
    drawMovingCircle(x, y, (TAU / 3) * i);
    pop();
  }
}

function drawMovingCircle(x, y, initial) {
  let angle = frameCount / 30 + initial;
  let x2 = x + cos(angle) * 100;
  let y2 = y + sin(angle) * 100;
  push();
  fill(255);
  ellipse(x2, y2, 8);
  pop();
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "png");
  }
}
