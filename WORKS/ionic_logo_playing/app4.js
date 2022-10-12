function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
}

function draw() {
  orbitControl();
  background(0, 0, 0.9);
  lights();
  fill("#3182FE");
  noStroke();
  // rotateX(millis() / 1000);
  // rotateY(millis() / 1000);

  torus(220, 20);
  // push();
  // rotateY(PI / 2);
  // rotateX(PI / 4);
  // torus(300, 10);
  // pop();
  // push();
  // rotateY(PI / 2);
  // rotateX(-PI / 4);
  // torus(350, 10);
  // pop();

  sphere(110);

  push();
  translate(
    220 * cos(-2 * radians(frameCount)),
    220 * sin(-2 * radians(frameCount)),
    0,
    // 250 * sin(-2 * radians(millis() / 10)),
  );
  sphere(45);
  pop();
}
