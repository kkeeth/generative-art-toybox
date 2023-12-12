let NUM = 50;
let snows = [];
let pg;

function preload() {
  // img = loadImage("21.jpg");
  img = loadImage("33.jpg");
}

function setup() {
  cnv = createCanvas(640, 400);
  pg = createGraphics(width, height);

  noStroke();
  pg.strokeWeight(3);
  img.resize(width, height);

  for (let col = 0; col < width; col += 2) {
    for (let row = 0; row < height; row += 2) {
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
    snow.velocity = random(1, 5);
    snow.swing = random(20, 50);
    snows.push(snow);
  }
}

function draw() {
  background(200, 8);
  image(pg, 0, 0);
  drawingContext.shadowColor = "#FFF";
  drawingContext.shadowBlur = 20;

  for (let i = 0; i < NUM; i++) {
    let { x, y, size, color, velocity, swing } = snows[i];

    fill(color);
    circle(x + swing * sin((frameCount + i) / 20), y, size);

    if (y > height) {
      x = random(width);
      snows[i].y = 0;
    }
    snows[i].y += velocity;
  }
}
