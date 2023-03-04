let aoff = 0;
let str = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 24; i++) {
    str.push(
      random([
        ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      ]),
    );
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  stroke(255);
  strokeCap(SQUARE);

  // left eye
  push();
  let lpos = -72;
  strokeWeight(16);
  translate(lpos, -56);
  line(-30, -10, 30, -10);
  line(0, -40, 0, 20);

  // right eye
  stroke("red");
  translate(-lpos * 2, 0);
  line(-30, -10, 30, -10);
  line(0, -40, 0, 20);
  pop();

  // nose
  push();
  ellipse(0, -32, 72, 72);
  pop();

  // mouse
  push();
  line(-100, 24, 100, 24);
  beginShape();
  for (let i = 0; i < PI; i += 0.01) {
    vertex(100 * cos(i), 10 * sin(i) + 24);
  }
  endShape(CLOSE);
  pop();

  // tongue
  push();
  fill(0);
  stroke(255);
  beginShape();
  for (let i = 0; i < PI; i += 0.01) {
    vertex(50 * cos(i), 100 * sin(i) + 24);
  }
  endShape(CLOSE);
  line(0, 24, 0, 100);
  pop();

  // outer rings
  push();
  strokeWeight(5);
  noFill();
  ellipse(0, -8, 300, 300);
  ellipse(0, -8, 372, 372);
  pop();

  // words
  push();
  textSize(24);
  textAlign(CENTER);
  fill(255);
  for (let i = 0; i < 24; i++) {
    let angle = map(i, 0, 24, 0, TAU);
    // rotate(1.57)
    text(str[i], 168 * cos(angle + aoff), 168 * sin(angle + aoff));
  }
  pop();
  aoff += 0.01;
}
