let g;
let movingPoint = 1;
let movingTarget = { x: 0, y: 0 };
let points = [];
let corners = [];

function setup() {
  createCanvas((W = windowHeight - 200), W);
  noStroke();

  g = W / 20;
  points = [
    { x: g, y: g },
    { x: W - g, y: W - g },
    { x: g, y: W - g },
  ];
  corners = [
    { x: g, y: g },
    { x: W - g, y: g },
    { x: W - g, y: W - g },
    { x: g, y: W - g },
  ];

  selectTarget();
}

function draw() {
  background(255);

  push();
  stroke("orange");
  for (let x = 0; x < W; x += g) {
    for (let y = 0; y < W; y += g) {
      line(x, 0, x, W);
      line(0, y, W, y);
    }
  }
  pop();

  let diffX = movingTarget.x - points[movingPoint].x;
  let diffY = movingTarget.y - points[movingPoint].y;
  points[movingPoint].x += diffX / 20;
  points[movingPoint].y += diffY / 20;

  // If the point has reached its target, select a new one
  if (
    dist(
      points[movingPoint].x,
      points[movingPoint].y,
      movingTarget.x,
      movingTarget.y,
    ) < 0.1
  ) {
    selectTarget();
  }

  fill("orange");
  triangle(
    points[0].x,
    points[0].y,
    points[1].x,
    points[1].y,
    points[2].x,
    points[2].y,
  );
}

function selectTarget() {
  movingPoint--;
  if (movingPoint < 0) movingPoint = points.length - 1;
  const nextTarget = corners.filter((corner) => {
    return !points.some(
      (point) => dist(corner.x, corner.y, point.x, point.y) < 0.1,
    );
  });
  movingTarget = nextTarget[0];
}
