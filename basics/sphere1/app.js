let radius = 150;

function setup() {
  createCanvas(640, 420, WEBGL);
  pixelDensity(displayDensity());
}

function draw() {
  background(255);
  rotateY(frameCount * 0.01);

  for (let dTheta = 0; dTheta <= 180; dTheta += 10) {
    const theta = radians(dTheta);
    const z = radius * cos(theta);
    const r = radius * sin(theta);

    drawCircle(z, r);
  }
}

/**
 * @param {Number} z z-coordinate
 * @param {Number} r radius
 */
function drawCircle(z, r) {
  for (let dPhi = 0; dPhi < 360; dPhi += 10) {
    const phi = radians(dPhi);
    // x-coordinate
    const x = r * cos(phi);
    // y-coordinate
    const y = r * sin(phi);

    stroke("#008080");
    strokeWeight(4);
    point(x, y, z);
  }
}
