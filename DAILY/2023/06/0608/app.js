const NUM = 100;
let objs = [];
let zoff = 3;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  smooth();
  stroke(200);

  for (let i = 0; i < NUM; i++) {
    objs.push({
      x: random(-width / 4, width / 4),
      y: random(-height / 4, height / 4),
      z: random(-height, height),
      s: random(10, 20),
      length: random(50, 120),
      color: color(random(255), random(255), random(255)),
    });
  }
}

function draw() {
  background(0);
  lights();
  let locX = 1 / 2 - width / 2;
  let locY = 1 / 2 - height / 2;
  pointLight(250, 250, 250, locX, locY, 50);

  for (let i = 0; i < NUM; i++) {
    push();
    fill(objs[i].color);
    translate(objs[i].x, objs[i].y, (objs[i].z += zoff));
    rotateX(HALF_PI);
    noStroke();
    cylinder(objs[i].s, objs[i].length, 9);
    // box(objs[i].s, objs[i].s, objs[i].length)
    pop();

    if (objs[i].z > height) {
      objs[i].z = -height / 2;
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 5);
  }
}
