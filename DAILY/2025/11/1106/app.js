// Torus Knot Parameters
let R = 240; // Major radius
let r = 60; // Minor radius
let p = 5; // Knot parameter p
let q = 2; // Knot parameter q

// Particle settings
let numPoints = 1000;
let particles = [];
let speed = 0.002; // Animation speed

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W, WEBGL);

  // Initialize particles
  for (let i = 0; i < numPoints; i++) {
    particles.push({
      color: color(random(150, 220), random(150, 220), random(150, 220)),
      offset: (i / numPoints) * TWO_PI, // Position on torus knot
      phase: random(TWO_PI), // Random starting phase for variation
    });
  }
}

function draw() {
  background(20);

  // Setup lighting and camera
  ambientLight(100);
  pointLight(255, 255, 255, 200, -200, 200);

  rotateX(PI / 3);

  // Draw particles
  strokeWeight(3);
  noFill();

  for (let particle of particles) {
    // Update particle position along the torus knot
    let t = particle.offset + frameCount * speed;

    // Calculate torus knot position using parametric equations
    let pos = torusKnot(t);
    stroke(particle.color);

    // Draw point
    push();
    translate(pos.x, pos.y, pos.z);
    point(0, 0, 0);
    pop();

    // Optional: draw small sphere instead of point for better visibility
    // push();
    // translate(pos.x, pos.y, pos.z);
    // sphere(1);
    // pop();
  }
}

// Torus Knot parametric equations
function torusKnot(t) {
  let x = (R + r * cos(q * t)) * cos(p * t);
  let y = (R + r * cos(q * t)) * sin(p * t);
  let z = r * sin(q * t);

  return { x: x, y: y, z: z };
}

function keyPressed() {
  if (key === 's') {
    saveGif(`torusKnot-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`torusKnot-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }

  // Adjust parameters with keys
  if (key === '1') numPoints = max(100, numPoints - 100);
  if (key === '2') numPoints = min(5000, numPoints + 100);
  if (key === '3') speed = max(0.0001, speed - 0.0005);
  if (key === '4') speed = min(0.01, speed + 0.0005);
}
