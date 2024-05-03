let cp;
let a1, a2;
let seed;
const arr1 = [], arr2 = [];

function setup() {
  createCanvas((W = windowHeight - 50), W, WEBGL);
  noStroke()
  frameRate(3)

  a1 = TAU / 8;
  a2 = TAU / 10;

  cp = shuffle(random(colorPalette).colors);
  seed = random(1000);

  for (let i = 0; i < TAU; i += a1) {
    arr1.push({
      x: 100 * cos(i),
      y: 100 * sin(i),
      size: 70
    })
  }

  for (let j = 0; j < TAU; j += a2) {
    arr2.push({
      x: 200 * cos(j),
      y: 200 * sin(j),
      size: 70
    })
  }
}

function draw() {
  background(255);
  randomSeed(seed);

  fill(cp[0]);
  for (let i of arr1) {
    push()
    if (dist(mouseX, mouseY, i.x, i.y) < 20) rotateY(frameCount * 0.01)
    ellipse(i.x, i.y, i.size);
    pop()
  }

  push()
  fill(cp[1]);
  for (let j of arr2) {
    ellipse(j.x, j.y, j.size);
  }
  pop()
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }

  if (key === "c") {
    saveCanvas("mySketch", "jpeg");
  }
}
