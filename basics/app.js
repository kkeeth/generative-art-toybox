function setup() {
  createCanvas(400, 400/*, WEBGL */);
  //smooth();
  //rectMode(CENTER);
  //ellipseMode(CENTER);
}

function draw() {
/**
 * draw various pattern's fan shapes
  background(220)
  arc(0, -150, 80, 80, 0, PI); // radian
  arc(0, -50, 80, 80, 0, radians(225), OPEN);
  arc(0, 50, 80, 80, 0, radians(225), PIE);
  arc(0, 150, 80, 80, 0, radians(225), CHORD);
 */

  //background(220)
  textSize(32);
  textFont("Helvetica");
  //text color("#008080")
  text("Hello World", 100, 50);
  fill(0, 102, 153);
  text("Hello World", 100, 100);
  fill(0, 102, 153, 127);
  text("Hello World", 100, 150);
}
