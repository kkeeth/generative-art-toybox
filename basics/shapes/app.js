function setup() {
  createCanvas(400, 400);
  smooth();
}

function draw() {
  background(220)
  arc(width/2, 30, 80, 80, 0, PI); // radian
  arc(width/2, 110, 80, 80, 0, radians(225), OPEN);
  arc(width/2, 190, 80, 80, 0, radians(225), PIE);
  arc(width/2, 270, 80, 80, 0, radians(200), CHORD);
}
