let radius = 150;

function setup() {
  createCanvas(640, 420, WEBGL);
  pixelDensity(displayDensity());
}


function draw() {
  background(255);
  translate(0, 30, 0);
  rotateY(frameCount * 0.02);
  
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;

  for (let dTheta = 0, dPhi = 0; dTheta <= 180; dTheta += 2, dPhi +=10) {
    const theta = radians(dTheta);
    const phi = radians(dPhi);

    const r = radius * sin(theta);
    // x-coordinate
    const x = r * cos(phi);
    // y-coordinate
    const y = r * sin(phi);
    // z-coordinate
    const z = radius * cos(theta);

    stroke(0);
    if (lastX != 0) {
      strokeWeight(1);
      line(lastX, lastY, lastZ, x, y, z);
    }

    strokeWeight(4);
    point(x, y, z);
    
    // update last coordinates
    lastX = x;
    lastY = y;
    lastZ = z;
  }
}
