const NUM = 8;
const cp = [
  "#ffb6b9",
  "#bbded6",
  "#fae3d9",
  "#8ac6d1",
  "#fff1ac",
  "#f9bcdd",
  "#d5a4cf",
  "#b689b0",
];
const length = 150;
let ships = [];
let tmpX, tmpY;
let target = 0;
let angle;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  blendMode(HARD_LIGHT);

  for (let i = 0; i < NUM; i++) {
    ships.push({
      x: ~~random(width),
      y: ~~random(height),
      targetX: 0,
      targetY: 0,
      initX: 0,
      initY: 0,
      lineColor: random(cp),
    });

    ships[i].targetX = ships[i].x;
    ships[i].targetY = ships[i].y;
    ships[i].initX = ships[i].x;
    ships[i].initY = ships[i].y;
  }
}

function draw() {
  background(0);
  for (let ship of ships) {
    push();
    stroke(ship.lineColor);
    strokeWeight(5);
    // ellipse(ship.targetX, ship.targetY, 20);
    line(ship.x, ship.y, ship.initX, ship.initY);
    push();
    translate(ship.x, ship.y);
    angle = atan2(ship.targetY - ship.y, ship.targetX - ship.x);
    rotate(angle);
    textSize(60);
    strokeWeight(2);
    text("✈", 0, 18);
    pop();
    pop();

    ship.x = lerp(ship.x, ship.targetX, 0.5);
    ship.y = lerp(ship.y, ship.targetY, 0.5);

    if (dist(ship.x, ship.y, ship.targetX, ship.targetY) < 1) {
      let cond = random();
      if (cond < 0.25) {
        ship.targetX += length;
      } else if (cond < 0.5) {
        ship.targetY += length;
      } else if (cond < 0.75) {
        ship.targetX -= length;
      } else {
        ship.targetY -= length;
      }
      if (ship.targetX < 0) {
        ship.targetX += length;
      } else if (ship.targetY < 0) {
        ship.targetY += length;
      } else if (ship.targetX > width) {
        ship.targetX -= length;
      } else if (ship.targetY > height) {
        ship.targetY -= length;
      }
      // ship.targetX = random(width);
      // ship.targetY = random(height);
      ship.initX = ship.x;
      ship.initY = ship.y;
    }
  }
}

function keyPressed() {
  // this will download the first 5 seconds of the animation!
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
