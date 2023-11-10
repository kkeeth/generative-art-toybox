const characters = [];
const strs = "p5 .js is so fun!";
let nextPoint;
let target = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(104);
  textAlign(CENTER, CENTER);

  const tx = random(72, width - 72);
  const ty = random(72, height - 72);
  for (let _ of strs) {
    characters.push({
      color: color(random(160, 255), random(160, 255), random(160, 255)),
      x: tx,
      y: ty,
    });
  }
  setNextPoint();
}

function draw() {
  background(0, 10);

  for (let i = 0; i < characters.length; i++) {
    if (strs[target] === " ") {
      target++;
      continue;
    }

    const { color, x, y } = characters[i];
    fill(color);
    text(strs[target], x, y);

    characters[i].x = lerp(
      x,
      nextPoint.x,
      map(i, 0, characters.length, 0.08, 0.05),
    );
    characters[i].y = lerp(
      y,
      nextPoint.y,
      map(i, 0, characters.length, 0.08, 0.05),
    );

    if (
      i === characters.length - 1 &&
      dist(x, y, nextPoint.x, nextPoint.y) < 0.8
    ) {
      setNextPoint();
      target++;

      if (target === strs.length) target = 0;
    }
  }
}

function setNextPoint() {
  nextPoint = {
    x: random(72, width - 72),
    y: random(72, height - 72),
  };
}

function keyPressed() {
  if (key === "s") {
    saveGif("mySketch", 6);
  }
}
