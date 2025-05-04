const cp = [
  '#ffb6b9',
  '#bbded6',
  '#fae3d9',
  '#8ac6d1',
  '#fff1ac',
  '#f9bcdd',
  '#d5a4cf',
  '#b689b0',
  '#382E37',
  '#DF642F',
  '#FAAB10',
  '#CB812B',
  '#3CAE64',
];

const radius = 70;
let spaceX, spaceY;
let pg;
let seed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  spaceX = width / 4;
  spaceY = height / 3;
  seed = random(10000);
}

function draw() {
  randomSeed(seed);

  for (let v = 0; v < height; v += spaceY) {
    for (let h = 0; h < width; h += spaceX) {
      drawRose(Math.floor(random(1, 9)), Math.floor(random(1, 9)), h, v);
    }
  }
}

/**
 *
 * @param {number} n numerator
 * @param {number} d denominator
 * @param {number} v vertical
 * @param {number} h horizontal
 */
function drawRose(n, d, v, h) {
  push();
  translate(v, h);
  pg = createGraphics(spaceX, spaceY);
  pg.randomSeed(10000);
  pg.noStroke();
  pg.blendMode(DIFFERENCE);
  pg.background(random(cp));
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);
  for (let angle = 0; angle < TWO_PI * d; angle += 0.5) {
    let range = radius * sin(angle * (n / d) + frameCount / 15);
    let x = range * cos(angle);
    let y = range * sin(angle);
    pg.ellipse(x, y, 30);
  }
  pg.pop();
  image(pg, 0, 0);
  pop();
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 3);
  }
}
