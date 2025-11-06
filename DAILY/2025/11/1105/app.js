function setup() {
  createCanvas((W = 400), W, WEBGL);
  fill(random(colorPalette).colors[1]);
  noStroke();
  smooth(1);
}

function draw() {
  background(255);
  lights();
  let locX = 1 / 2 - width / 2;
  let locY = 1 / 2 - height / 2;
  pointLight(250, 250, 250, locX, locY, 50);
  orbitControl();

  torus(W / 4, 40);
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
