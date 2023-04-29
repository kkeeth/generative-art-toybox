let seed = 0;

function setup() {
  createCanvas((W = windowHeight), W);
  seed = ~~random(10000);
  noStroke();
}
function draw() {
  randomSeed(seed);
  background(255);
  recursiveRect(0, 0, width, height, 3);

  if (frameCount % 200 === 0) {
    seed++;
  }
  if (seed === 10000) seed = 0;
}

function calcDim(a, b, c, d) {
  return (c * d) / (a * b);
}

function recursiveRect(x, y, w, h, depth) {
  if (depth < 0) return;
  let rsx = random(10000);
  let rsy = random(10000);
  let t = ((x + y * w) / (w * h) / 10 + frameCount / 1000) % 1;
  // t = easeInOutCirc(sin(t * 360) / 2 + 0.5);
  t = random(10, 100);
  let nw = (sin(rsx + y / 20 + t * 360) / 2.5 / 1.5 + 0.5) * w;
  let nh = (cos(rsy + x / 20 + t * 360) / 3 / 1.5 + 0.5) * h;
  fill(random(255), random(255), random(255), 127);

  if (depth == 0) {
    rect(x, y, nw, nh, t);
    rect(x + nw, y, w - nw, nh, t);
    rect(x, y + nh, nw, h - nh, t);
    rect(x + nw, y + nh, w - nw, h - nh, t);
  } else {
    // recursiveRect(x, y, nw, nh, depth - 1);
    rect(x, y, nw, nh, t);
    recursiveRect(x + nw, y, w - nw, nh, depth - 1);
    recursiveRect(x, y + nh, nw, h - nh, depth - 1);
    recursiveRect(x + nw, y + nh, w - nw, h - nh, depth - 1);
  }
}

function easeInOutCirc(x) {
  return x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("myCanvas", "png");
  }
}

