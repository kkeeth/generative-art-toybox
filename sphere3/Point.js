class Point {
  constructor(num) {
    const radius = 150;
    const phi = random(TWO_PI);
    const unitZ = random(-1, 1);

    const r = radius * sqrt(1 - unitZ * unitZ);
    // x-coordinate
    this.x = r * cos(phi);
    // y-coordinate
    this.y = r * sin(phi);
    // z-coordinate
    this.z = radius * unitZ;  
  }
  
  display() {
    stroke(0);
    strokeWeight(3);
    point(this.x, this.y, this.z);
  }
}
