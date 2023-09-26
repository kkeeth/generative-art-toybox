const radius = 150;

function setup() {
  createCanvas((W = windowHeight - 100), W, WEBGL);
  stroke(255);
  strokeWeight(2);
}

function draw() {
  background(0);
  orbitControl();
  rotateX(HALF_PI / 1.5);
  translate(0, 100, 50);
  for (let phi = 0; phi < TAU; phi += 0.1) {
    for (let theta = 0; theta < PI; theta += 0.1) {
      let r = radius * sin(theta);
      // let x = r * sin(theta) * sin(phi);
      let x = r * cos(phi);
      // let y = r * sin(theta) * cos(phi);
      let y = r * sin(phi);
      let z = r * cos(theta);
      point(x, y, z);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
