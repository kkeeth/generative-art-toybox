let yPos = xoff = 0;
function setup() {
  createCanvas(300, 300);
  smooth();
  // setup() runs once
  frameRate(30);
}

function draw() {
  // draw() loops forever, until stopped
  background(204);
  yPos = noise(xoff) * height;
  if (yPos < 0) {
    yPos = height;
  }
  line(0, yPos, width, yPos);

  textSize(32);
  textAlign(CENTER, CENTER);
  textFont("Futura");
  fill("#000");
  text("Hello World", width/2, 100);
  fill(0, 102, 153);
  text("Hello World", width/2, 150);
  fill(0, 102, 153, 127);
  text("Hello World", width/2, 200);

  xoff += 0.01
}
