let vecs = [];
let num = 1;
const colors = ["red", "blue", "green", "yellow", "purple", "black", "skyblue"];

function setup() {
  createCanvas((w = 600), (h = w));
  noStroke();

  for (let i = 0; i < num; i++) {
    let vec = createVector(random(w), random(h));
    vec.velocity = createVector(random(2, 5), 10);
    vec.gravity = createVector(0, 2);
    vec.color = random(colors);
    vec.size = random(30, 100);
    vecs.push(vec);
  }
}
function draw() {
  background(220);

  for (let vec of vecs) {
    if (vec.x + vec.size / 2 > width || vec.x - vec.size / 2 < 0) {
      vec.velocity.x *= -1;
    }
    if (vec.y + vec.size / 2 > height || vec.y < 0) {
      vec.velocity.y *= -1;
    }
    fill(vec.color);
    circle(vec.x, vec.y, vec.size);
    vec.velocity.add(vec.gravity);
    vec.add(vec.velocity);
  }
}
