let particles = [];
let attractors = [];
let W;
let time = 0;
let currentPalette;
let trailCanvas;
let mouseTrail = [];
let explosions = [];

function setup() {
  W = min(windowWidth, windowHeight) - 50;
  createCanvas(W, W);
  
  trailCanvas = createGraphics(W, W);
  trailCanvas.background(10, 10, 15, 50);
  
  currentPalette = random(colorPalette);
  
  // Initialize particles
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle(random(W), random(W)));
  }
  
  // Initialize attractors
  for (let i = 0; i < 3; i++) {
    attractors.push(new Attractor(random(W), random(W)));
  }
  
  background(10, 10, 15);
}

function draw() {
  time += 0.01;
  
  // Fade background
  trailCanvas.fill(10, 10, 15, 15);
  trailCanvas.noStroke();
  trailCanvas.rect(0, 0, W, W);
  
  // Update and draw attractors
  for (let attractor of attractors) {
    attractor.update();
    attractor.display();
  }
  
  // Update and draw particles
  for (let particle of particles) {
    // Apply forces from attractors
    for (let attractor of attractors) {
      let force = attractor.attract(particle);
      particle.applyForce(force);
    }
    
    // Mouse interaction
    if (mouseIsPressed) {
      let mouseForce = particle.seekMouse();
      particle.applyForce(mouseForce);
    }
    
    particle.update();
    particle.display();
  }
  
  // Update mouse trail
  updateMouseTrail();
  drawMouseTrail();
  
  // Update explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].display();
    if (explosions[i].isDead()) {
      explosions.splice(i, 1);
    }
  }
  
  // Draw trail canvas
  image(trailCanvas, 0, 0);
  
  // Interactive glow effect
  if (mouseX > 0 && mouseX < W && mouseY > 0 && mouseY < W) {
    drawGlow(mouseX, mouseY, 80);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.size = random(4, 9);
    this.color = random(currentPalette.colors);
    this.hue = random(360);
    this.brightness = random(150, 255);
    this.alpha = 255;
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  seekMouse() {
    let mouse = createVector(mouseX, mouseY);
    let force = p5.Vector.sub(mouse, this.pos);
    force.normalize();
    force.mult(0.1);
    return force;
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Wrap around edges
    if (this.pos.x < 0) this.pos.x = W;
    if (this.pos.x > W) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = W;
    if (this.pos.y > W) this.pos.y = 0;
    
    // Dynamic color cycling
    this.hue = (this.hue + 1) % 360;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Main particle
    colorMode(HSB, 360, 100, 100, 255);
    fill(this.hue, 80, this.brightness, 200);
    noStroke();
    ellipse(0, 0, this.size);
    
    // Glow effect
    for (let r = this.size; r < this.size * 3; r += 2) {
      fill(this.hue, 60, this.brightness, 30);
      ellipse(0, 0, r);
    }
    
    // Draw to trail canvas
    trailCanvas.push();
    trailCanvas.translate(this.pos.x, this.pos.y);
    trailCanvas.colorMode(HSB, 360, 100, 100, 255);
    trailCanvas.fill(this.hue, 90, this.brightness, 100);
    trailCanvas.noStroke();
    trailCanvas.ellipse(0, 0, this.size * 0.5);
    trailCanvas.pop();
    
    pop();
  }
}

class Attractor {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.mass = random(20, 50);
    this.angle = 0;
    this.orbit = random(50, 150);
    this.speed = random(0.01, 0.03);
  }
  
  attract(particle) {
    let force = p5.Vector.sub(this.pos, particle.pos);
    let distance = force.mag();
    distance = constrain(distance, 5, 50);
    let strength = (this.mass * particle.size) / (distance * distance);
    force.normalize();
    force.mult(strength * 0.1);
    return force;
  }
  
  update() {
    this.angle += this.speed;
    let centerX = W / 2 + cos(time * 0.5) * 100;
    let centerY = W / 2 + sin(time * 0.7) * 100;
    this.pos.x = centerX + cos(this.angle) * this.orbit;
    this.pos.y = centerY + sin(this.angle) * this.orbit;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    colorMode(HSB, 360, 100, 100, 255);
    let hue = (time * 50) % 360;
    
    // Pulsing core
    let pulse = sin(time * 5) * 0.5 + 0.5;
    fill(hue, 100, 100, 150);
    noStroke();
    ellipse(0, 0, this.mass * 0.3 + pulse * 10);
    
    // Rotating rings
    stroke(hue, 80, 80, 100);
    strokeWeight(2);
    noFill();
    for (let i = 1; i <= 3; i++) {
      push();
      rotate(time * i);
      ellipse(0, 0, this.mass * i * 0.5);
      pop();
    }
    
    pop();
  }
}

class Explosion {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.particles = [];
    this.life = 255;
    
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        pos: createVector(x, y),
        vel: p5.Vector.random2D().mult(random(2, 8)),
        life: 255,
        size: random(3, 8),
        color: random(currentPalette.colors)
      });
    }
  }
  
  update() {
    this.life -= 3;
    for (let p of this.particles) {
      p.pos.add(p.vel);
      p.vel.mult(0.98);
      p.life -= 5;
      p.size *= 0.98;
    }
  }
  
  display() {
    for (let p of this.particles) {
      if (p.life > 0) {
        push();
        translate(p.pos.x, p.pos.y);
        fill(red(p.color), green(p.color), blue(p.color), p.life);
        noStroke();
        ellipse(0, 0, p.size);
        pop();
      }
    }
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function updateMouseTrail() {
  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    mouseTrail.push({
      x: mouseX,
      y: mouseY,
      life: 60
    });
  }
  
  for (let i = mouseTrail.length - 1; i >= 0; i--) {
    mouseTrail[i].life--;
    if (mouseTrail[i].life <= 0) {
      mouseTrail.splice(i, 1);
    }
  }
}

function drawMouseTrail() {
  if (mouseTrail.length > 1) {
    stroke(255, 100, 255, 150);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let point of mouseTrail) {
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function drawGlow(x, y, size) {
  push();
  translate(x, y);
  colorMode(HSB, 360, 100, 100, 255);
  let hue = (time * 100) % 360;
  
  for (let r = size; r > 0; r -= 5) {
    fill(hue, 100, 100, 20);
    noStroke();
    ellipse(0, 0, r);
  }
  pop();
}

function mousePressed() {
  // Create explosion at mouse position
  explosions.push(new Explosion(mouseX, mouseY));
  
  // Add new particles
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(mouseX + random(-20, 20), mouseY + random(-20, 20)));
  }
  
  // Randomize colors if right mouse button (or with shift)
  if (mouseButton === RIGHT || keyIsPressed && key === ' ') {
    currentPalette = random(colorPalette);
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`multicolor-animation-${round(new Date().getTime() / 100000)}`, 5);
  }
  
  if (key === 'c') {
    saveCanvas(`multicolor-animation-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
  
  if (key === 'r') {
    // Reset animation
    particles = [];
    explosions = [];
    currentPalette = random(colorPalette);
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle(random(W), random(W)));
    }
  }
  
  if (key === 'p') {
    // Change color palette
    currentPalette = random(colorPalette);
  }
}

function windowResized() {
  W = min(windowWidth, windowHeight) - 50;
  resizeCanvas(W, W);
  trailCanvas = createGraphics(W, W);
}
