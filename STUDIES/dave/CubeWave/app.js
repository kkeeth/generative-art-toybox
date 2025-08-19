let angle = 0;
let w = 24;
let ma;
let maxD;

function setup() {
  createCanvas(600, 600, WEBGL);
  rectMode(CENTER);
  noStroke();

  ma = atan(1 / sqrt(2));
  maxD = dist(0, 0, width / 3, height / 3);
}

function draw() {
  background(100);
  ortho(-400, 400, 400, -400, 0, 1000);

  rotateX(QUARTER_PI);
  rotateY(ma);

  for (let x = 0; x < width - 100; x += w) {
    for (let z = 0; z < height - 100; z += w) {
      push();
      let d = dist(x, z, width / 2 - 50, height / 2 - 50);
      let offset = map(d, 0, maxD, -PI, PI);
      let a = angle + offset;
      let h = map(sin(a), -1, 1, 100, 500);
      translate(x - width / 4, -height / 4, z - height / 1.5);
      normalMaterial();
      box(w - 2, h, w - 2);
      pop();
    }
  }

  angle += 0.05;
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === 's') {
    saveGif('mySketch', 5);
  }
}
