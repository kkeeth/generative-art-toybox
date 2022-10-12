let xoff = 0;
let loopCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
}

function draw() {
  orbitControl();
  background(100, 0, 0);
  lights();
  // rotateX(millis() / 1000);
  // rotateY(millis() / 1000);

  // 3D
  push();
  noStroke();
  fill("#3182FE");
  torus(220, 20);
  pop();

  push();
  fill("#3182FE");
  stroke("#FFF");
  noStroke();
  sphere(110);
  pop();

  push();
  noStroke();
  fill("#3182FE");
  translate(
    // if change frameCount to noise(xoff) * 220)),
    // then the small sphere movement are chaos!!
    220 * cos(-2 * radians(frameCount)),
    220 * sin(-2 * radians(frameCount)),
    220 * sin(-2 * radians(millis() / 10)),
  );
  sphere(45);
  pop();

  xoff += 0.01;
  loopCount++;
}
