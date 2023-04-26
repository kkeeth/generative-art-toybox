const cp = [
  "#7B51A5",
  "#1B9C93",
  "#EF84C1",
  "#FA9920",
  "#EA4348",
  "#76A4E2",
  "#8BAD49",
];
const timeAnimationDuration = 1000;

let segmentSize;
let gapSize;
let prevDisplayTime;
let prevTimeString;
let seed;

function setup() {
  createCanvas(800, 400);
  textAlign(CENTER, CENTER);
  strokeWeight(6);
  strokeCap(ROUND);
  frameRate(30);

  segmentSize = width / 16;
  gapSize = segmentSize / 4;
  seed = random(100);
  prevDisplayTime = new Date();
  prevTimeString = `${String(hour()).padStart(2, "0")}:${String(
    minute(),
  ).padStart(2, "0")}:${String(second()).padStart(2, "0")}`;
}

function draw() {
  background(255);
  randomSeed(seed);

  const displayHours = String(hour()).padStart(2, "0");
  const displayMinutes = String(minute()).padStart(2, "0");
  const displaySeconds = String(second()).padStart(2, "0");
  const timeString = `${displayHours}:${displayMinutes}:${displaySeconds}`;

  push();
  translate(50, 100);

  for (let i = 0; i < timeString.length; i++) {
    if (timeString[i] !== ":") {
      if (timeString[i] !== prevTimeString[i]) {
        drawDigit(
          timeString[i],
          i * (segmentSize + gapSize * 2),
          segmentSize,
          true,
        );
      } else {
        drawDigit(
          timeString[i],
          i * (segmentSize + gapSize * 2),
          segmentSize,
          false,
        );
      }
    } else {
      drawColon(i * (segmentSize + gapSize * 2), segmentSize);
    }
  }
  if (
    displaySeconds !== String(prevDisplayTime.getSeconds()).padStart(2, "0")
  ) {
    prevDisplayTime = new Date();
    prevTimeString = `${
      displayMinutes === "00"
        ? String(displayHours - 1).padStart(2, "0")
        : displayHours
    }:${
      displaySeconds === "00"
        ? String(displayMinutes - 1).padStart(2, "0")
        : displayMinutes
    }:${
      displaySeconds === "00"
        ? "59"
        : String(displaySeconds - 1).padStart(2, "0")
    }`;
  }

  pop();
}

function drawDigit(digit, x, y, animate) {
  const segmentCombinations = [
    [0, 1, 2, 3, 4, 5],
    [1, 2],
    [0, 1, 3, 4, 6],
    [0, 1, 2, 3, 6],
    [1, 2, 5, 6],
    [0, 2, 3, 5, 6],
    [0, 2, 3, 4, 5, 6],
    [0, 1, 2],
    [0, 1, 2, 3, 4, 5, 6],
    [0, 1, 2, 3, 5, 6],
  ];

  const segmentsToDraw = segmentCombinations[digit];

  for (const segmentIndex of segmentsToDraw) {
    drawSegment(x, y, segmentIndex, animate);
  }
}

function drawSegment(x, y, segmentIndex, animate) {
  const segments = [
    [
      [0, 0],
      [segmentSize, 0],
    ],
    [
      [segmentSize, 0],
      [segmentSize, segmentSize],
    ],
    [
      [segmentSize, segmentSize],
      [segmentSize, 2 * segmentSize],
    ],
    [
      [0, 2 * segmentSize],
      [segmentSize, 2 * segmentSize],
    ],
    [
      [0, segmentSize],
      [0, 2 * segmentSize],
    ],
    [
      [0, 0],
      [0, segmentSize],
    ],
    [
      [0, segmentSize],
      [segmentSize, segmentSize],
    ],
  ];

  const start = segments[segmentIndex][0];
  const end = segments[segmentIndex][1];

  const startX = animate
    ? lerp(start[0], end[0], getAnimationProgress())
    : end[0];

  const startY = animate
    ? lerp(start[1], end[1], getAnimationProgress())
    : end[1];

  stroke(random(cp));
  line(x + start[0], y + start[1], x + startX, y + startY);
}

function drawColon(x, y) {
  fill(random(cp));
  circle(x + segmentSize / 2, y + segmentSize / 2, 5);
  circle(x + segmentSize / 2, y + 1.5 * segmentSize, 5);
  noFill();
}

function getAnimationProgress() {
  const timeElapsed = new Date() - prevDisplayTime;
  return constrain(timeElapsed / timeAnimationDuration, 0, 1);
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 10);
  }
}
