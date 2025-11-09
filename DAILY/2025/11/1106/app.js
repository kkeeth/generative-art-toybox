// Torus Knot Configuration
class TorusKnotConfig {
  constructor(R, r, p, q) {
    this.R = R; // Major radius
    this.r = r; // Minor radius
    this.p = p; // Knot parameter p
    this.q = q; // Knot parameter q
    this.noiseScale = random(0.001, 0.005); // Noise scale for irregularity
    this.noiseOffset = random(1000); // Unique noise offset for each knot
  }
}

// Particle class for better organization
class Particle {
  constructor(color, offset, knotIndex) {
    this.color = color;
    this.offset = offset;
    this.knotIndex = knotIndex;
    this.phase = random(TWO_PI);
    this.rotationSpeedX = random(0.05, 0.15);
    this.rotationSpeedY = random(0.05, 0.15);
    this.rotationSpeedZ = random(0.05, 0.15);
    this.rotationX = random(TWO_PI);
    this.rotationY = random(TWO_PI);
    this.rotationZ = random(TWO_PI);
    this.size = random(12, 20);
    this.pulseSpeed = random(0.02, 0.05);
    this.pulseOffset = random(TWO_PI);
  }

  update(t, knot) {
    this.rotationX += this.rotationSpeedX;
    this.rotationY += this.rotationSpeedY;
    this.rotationZ += this.rotationSpeedZ;
  }

  getPosition(t, knot) {
    // Base torus knot position
    let pos = torusKnot(t, knot);

    // Add Perlin noise for irregularity
    let noiseX = noise(t * knot.noiseScale + knot.noiseOffset, 0) * 50 - 25;
    let noiseY = noise(t * knot.noiseScale + knot.noiseOffset, 100) * 50 - 25;
    let noiseZ = noise(t * knot.noiseScale + knot.noiseOffset, 200) * 50 - 25;

    pos.x += noiseX;
    pos.y += noiseY;
    pos.z += noiseZ;

    return pos;
  }

  display(t, knot) {
    let pos = this.getPosition(t, knot);

    // Pulsing size effect
    let pulseSize =
      this.size + sin(frameCount * this.pulseSpeed + this.pulseOffset) * 3;

    // Distance-based alpha (fade distant particles)
    let distance = dist(0, 0, 0, pos.x, pos.y, pos.z);
    let alpha = map(distance, 0, 500, 255, 100);

    let displayColor = color(
      red(this.color),
      green(this.color),
      blue(this.color),
      // alpha,
    );

    stroke(displayColor);
    strokeWeight(0.5);
    // fill(displayColor);

    push();
    translate(pos.x, pos.y, pos.z);
    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);
    box(pulseSize);
    pop();
  }
}

// Global variables
let knotConfigs = [];
let particles = [];
let speed = 0.002;
let numParticlesPerKnot = 80;
let trails = [];

// Color palettes
let colorPalettes = colorPalette;
let currentPalette = 0;

// Camera control
let camX = 0;
let camY = 0;

function setup() {
  createCanvas(
    min(windowWidth, windowHeight) - 50,
    min(windowWidth, windowHeight) - 50,
    WEBGL,
  );

  // colorPalettes = [
  //   [color(255, 100, 100), color(100, 150, 255), color(150, 255, 150)],
  //   [color(255, 200, 100), color(200, 100, 255), color(100, 255, 200)],
  //   [color(255, 255, 255), color(200, 200, 255), color(255, 200, 200)],
  //   [color(255, 150, 0), color(0, 200, 255), color(255, 0, 150)],
  // ];

  // Initialize multiple torus knot configurations
  initializeKnots();

  // Initialize particles for each knot
  initializeParticles();
}

function initializeKnots() {
  knotConfigs = [];

  // Create 3-5 different torus knots with varying parameters
  let numKnots = floor(random(3, 6));

  for (let i = 0; i < numKnots; i++) {
    let R = random(200, 350);
    let r = random(50, 100);
    let p = floor(random(2, 5));
    let q = floor(random(5, 10));

    knotConfigs.push(new TorusKnotConfig(R, r, p, q));
  }
}

function initializeParticles() {
  particles = [];

  for (let k = 0; k < knotConfigs.length; k++) {
    let palette = colorPalettes[currentPalette].colors;

    for (let i = 0; i < numParticlesPerKnot; i++) {
      let particleColor = palette[floor(random(palette.length))];
      let offset = (i / numParticlesPerKnot) * TWO_PI;

      particles.push(new Particle(particleColor, offset, k));
    }
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(50);

  rotateX(PI / 6);

  // Lighting
  ambientLight(80);
  pointLight(255, 255, 255, 400, -400, 400);
  pointLight(150, 150, 255, -400, 400, -400);

  // Camera control
  let camDist = 800 + sin(frameCount * 0.01) * 100; // Slight zoom animation
  camera(
    camX + sin(frameCount * 0.005) * 50,
    camY + cos(frameCount * 0.003) * 50,
    camDist,
    0,
    0,
    0,
    0,
    1,
    0,
  );

  // Draw all particles
  for (let particle of particles) {
    let knot = knotConfigs[particle.knotIndex];
    let t = particle.offset + frameCount * speed;

    particle.update(t, knot);
    particle.display(t, knot);
  }

  // Draw subtle wireframe reference
  if (frameCount % 60 < 30) {
    drawKnotWireframes();
  }
}

function drawKnotWireframes() {
  noFill();
  strokeWeight(0.3);

  for (let k = 0; k < knotConfigs.length; k++) {
    stroke(255, 255, 255, 20);
    beginShape();

    let steps = 200;
    for (let i = 0; i <= steps; i++) {
      let t = (i / steps) * TWO_PI;
      let pos = torusKnot(t, knotConfigs[k]);
      vertex(pos.x, pos.y, pos.z);
    }

    endShape(CLOSE);
  }
}

// Torus Knot parametric equations
function torusKnot(t, knot) {
  let x = (knot.R + knot.r * cos(knot.q * t)) * cos(knot.p * t);
  let y = (knot.R + knot.r * cos(knot.q * t)) * sin(knot.p * t);
  let z = knot.r * sin(knot.q * t);

  return { x: x, y: y, z: z };
}

function keyPressed() {
  // Save functions
  if (key === 's') {
    saveGif(`torusKnot-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`torusKnot-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }

  // Regenerate with new parameters
  if (key === 'r') {
    initializeKnots();
    initializeParticles();
  }

  // Change color palette
  if (key === 'p' || key === 'P') {
    currentPalette = (currentPalette + 1) % colorPalettes.length;
    initializeParticles();
  }

  // Toggle wireframe
  if (key === 'w' || key === 'W') {
    // Already implemented as animation
  }
}

function windowResized() {
  let size = min(windowWidth, windowHeight) - 50;
  resizeCanvas(size, size);
}
