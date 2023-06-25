const cp = ["#359560", "#D22A2E", "#CA6772", "#0A91D3", "#EFB64E"];
const padding = 50;
let ydiff = 150;
let yvec = 1;
let seed;

function setup() {
  createCanvas((W = windowHeight - padding), W);
  shuffle(cp, true);
  strokeWeight(2);
  angleMode(DEGREES);
  seed = random(9999);
}

function draw() {
  randomSeed(seed);
  background(255);
  translate(0, height / 2);

  // wave1
  stroke(random(cp));
  for (let i = 0; i <= 5000; i++) {
    let x = random(padding, width - padding);
    point(
      x,
      random(
        sin(sin(sin(x) * ydiff) * ydiff) *
          cos(cos(cos(x) * ydiff) * ydiff) *
          ydiff,
        height / 2.5,
      ),
    );
  }

  ydiff += cos(frameCount / 100) * yvec;
  if (ydiff > height / 2.5 || ydiff < -height / 2.5) yvec *= -1;
}

function keyPressed() {
  if (key === "c") {
    saveCanvas("mySketch", "png");
  }

  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
