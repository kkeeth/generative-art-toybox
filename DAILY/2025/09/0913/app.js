let points = [];
let cp = [];
let seed;

const numPoints = 500;
const volumeSize = 500;
const noiseScale = 0.8;
const sphereRadius = 2.5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  cp = random(colorPalette).colors;
  seed = random(1000);

  let xOffset = random(1000);
  let yOffset = random(1000);
  let zOffset = random(1000);

  for (let i = 0; i < numPoints; i++) {
    let x = map(noise(xOffset), 0, 1, -volumeSize, volumeSize);
    let y = map(noise(yOffset), 0, 1, -volumeSize, volumeSize);
    let z = map(noise(zOffset), 0, 1, -volumeSize, volumeSize);

    points.push(createVector(x, y, z));

    xOffset += noiseScale;
    yOffset += noiseScale;
    zOffset += noiseScale;
  }

  const blendAmount = numPoints / 4;
  for (let i = 0; i < blendAmount; i++) {
    const ratio = i / blendAmount;
    const index = numPoints - blendAmount + i;
    points[index] = p5.Vector.lerp(points[index], points[0], ratio);
  }
}

function draw() {
  background(255);
  randomSeed(seed);
  orbitControl();
  noFill();

  beginShape();
  for (const p of points) {
    stroke(random(cp));
    vertex(p.x, p.y, p.z);
  }
  vertex(points[0].x, points[0].y, points[0].z);
  endShape();

  noStroke();
  fill(50);

  for (const p of points) {
    push();
    translate(p.x, p.y, p.z);
    stroke(cp[3]);
    sphere(sphereRadius);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'c') {
    saveCanvas(
      `dense-geometric-pattern-${round(new Date().getTime() / 100000)}`,
      'jpeg',
    );
  }
}
