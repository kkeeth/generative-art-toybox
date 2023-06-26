const NUM = 12;
let n;
let cnv;

function setup() {
  cnv = createCanvas((W = windowHeight), W);
  cnv.position((windowWidth - W) / 2, (windowHeight - W) / 2);
  noLoop();
  noFill();
  stroke(255);
  colorMode(HSB, 2 * W);

  n = width / NUM;
}

function draw() {
  background(100);

  for (let i = 0; i < W + n; i += n) {
    for (let j = 0; j < W + n; j += n) {
      stroke(i + j, W / 1.5, 2 * W);
      circle(i, j, n);
      circle(i + n / 2, j + n / 2, n);
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("myCanvas", "png");
  }
}

