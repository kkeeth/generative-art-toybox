let systems = [];
let numSystems = 30;

function setup() {
  createCanvas((W = windowHeight - 100), W);
  for (let i = 0; i < numSystems; i++) {
    let centerX = random(width);
    let centerY = random(height);
    systems.push(new PlanetarySystem(centerX, centerY, 10));
  }
}

function draw() {
  background(0, 20);
  for (let system of systems) {
    system.update();
    system.display();
  }
}

class PlanetarySystem {
  constructor(centerX, centerY, numPlanets) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.planets = [];
    for (let i = 0; i < numPlanets; i++) {
      let radius = random(1, 4);
      let distance = random(30, 100);
      let speed = random(0.01, 0.05);
      let position = random(TAU);
      let color = [random(120, 255), random(120, 255), random(120, 255)];
      this.planets.push(new Planet(radius, distance, speed, position, color));
    }
  }

  update() {
    for (let planet of this.planets) {
      planet.update();
    }
  }

  display() {
    for (let planet of this.planets) {
      planet.display(this.centerX, this.centerY);
    }
  }
}

class Planet {
  constructor(radius, distance, speed, position, color) {
    this.radius = radius;
    this.distance = distance;
    this.speed = speed;
    this.color = color;
    this.position = position;
    this.direction = random([-1, 1]);
  }

  update() {
    this.position += this.speed// * this.direction;
  }

  display(centerX, centerY) {
    fill(this.color);
    noStroke();
    // let x = centerX + cos(this.angle) * this.distance * noise(centerX * frameCount / 1000, centerY * frameCount / 1000);
    // let y = centerY + sin(this.angle) * this.distance * noise(centerX * frameCount / 1000, centerY * frameCount / 1000);

    let angle = this.position % TAU;
    let x, y;

    if (angle < PI / 2) {
      // Top side
      x = lerp(-this.distance, this.distance, angle / (PI / 2));
      y = -this.distance;
    } else if (angle < PI) {
      // Right side
      x = this.distance;
      y = lerp(-this.distance, this.distance, (angle - PI / 2) / (PI / 2));
    } else if (angle < 3 * PI / 2) {
      // Bottom side
      x = lerp(this.distance, -this.distance, (angle - PI) / (PI / 2));
      y = this.distance;
    } else {
      // Left side
      x = -this.distance;
      y = lerp(this.distance, -this.distance, (angle - 3 * PI / 2) / (PI / 2));
    }

    ellipse(centerX + x * this.direction, centerY + y, this.radius * 2);
  }
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 4);
  }
}
