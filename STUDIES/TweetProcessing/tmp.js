function draw() {
  background(200);

  // Create a variable, proportional to the mouseX,
  // varying from 0-360, to represent an angle in degrees.
  let myDegrees = map(mouseX, 0, width, 0, 360);

  // Display that variable in an onscreen text.
  // (Note the nfc() function to truncate additional decimal places,
  // and the "\xB0" character for the degree symbol.)
  let readout = "angle = " + nfc(myDegrees, 1) + "\xB0";
  noStroke();
  fill(0);
  text(readout, 5, 15);

  // Create a p5.Vector using the fromAngle function,
  // and extract its x and y components.
  let v = p5.Vector.fromAngle(radians(myDegrees), 30);
  let vx = v.x;
  let vy = v.y;

  push();
  translate(width / 2, height / 2);
  noFill();
  stroke(150);
  line(0, 0, 30, 0);
  stroke(0);
  line(0, 0, vx, vy);
  pop();
}
