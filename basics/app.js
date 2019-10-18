function setup() {
  createCanvas(400, 400);
  smooth();
}

function draw() {
  background(220)
  arc(0, -150, 80, 80, 0, PI); // radian
  arc(0, -50, 80, 80, 0, radians(225), OPEN);
  arc(0, 50, 80, 80, 0, radians(225), PIE);
  arc(0, 150, 80, 80, 0, radians(225), CHORD);
}
