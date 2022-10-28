let NUM = 50;
let snows = [];
let pg;

function preload() {
  // img = loadImage("21.jpg");
  img = loadImage("33.jpg");
}

function setup() {
  cnv = createCanvas(img.width, img.height);
  pg = createGraphics(img.width, img.height);

  let newCanvasX = (windowWidth - img.width) / 2;
  let newCanvasY = (windowHeight - img.height) / 2;
  cnv.position(newCanvasX, newCanvasY);
  noStroke();

  for (let col = 0; col < img.width; col += 1) {
    for (let row = 0; row < img.height; row += 1) {
      let xPos = col;
      let yPos = row;
      let c = img.get(xPos, yPos);

      pg.stroke(c);
      pg.point(xPos, yPos);
    }
  }

  for (let i = 0; i < NUM; i++) {
    let snow = createVector(random(width), random(height));
    snow.size = random(3, 10);
    snow.color = color(255, random(100, 255));
    snow.velocity = map(snow.color.levels[3], 100, 255, 1, 3);
    snows.push(snow);
  }
}

function draw() {
  // pg.background(0, 1);

  image(pg, 0, 0);

  for (let i = 0; i < NUM; i++) {
    let { x, y, size, color, velocity } = snows[i];

    fill(color);
    circle(x, y, size);

    if (y > height) {
      x = random(width);
      snows[i].y = 0;
    }
    snows[i].y += velocity;
  }
}
