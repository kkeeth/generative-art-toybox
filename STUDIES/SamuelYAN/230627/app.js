// https://openprocessing.org/sketch/1963375

// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/

var seed = Math.random() * 3987;
var particles = [];
var mySize, margin;

let colors0 = "fef9fb-fafdff-ffffff-fcfbf4-f9f8f6"
  .split("-")
  .map((a) => "#" + a);
let colors7 = "fefefe-292929-ffffff-222222-202020"
  .split("-")
  .map((a) => "#" + a);
let colors8 =
  "f7f6cf-b6d8f2-f4cfdf-9ac8eb-ccd4bf-e7cba9-eebab2-f5f3f7-f5e2e4-f4c815-f9cad7-A57283-c1d5de-deede6-AAD9CD-E8D595-E9BBB5-E7CBA9-8DA47E"
    .split("-")
    .map((a) => "#" + a);
let colors81 =
  "8c75ff-c553d2-2dfd60-2788f5-23054f-f21252-8834f1-c4dd92-184fd3-f9fee2-2E294E-541388-F1E9DA-FFD400-D90368-e9baaa-ffa07a-164555-ffe1d0-acd9e7-4596c7-6d8370-e45240-21d3a4-3303f9-cd2220-173df6-244ca8-a00360-b31016"
    .split("-")
    .map((a) => "#" + a);
let color_sel1, color_sel2;

//new tone I+III
let newTone01 = "FF9494-FFD1D1-FFE3E1-FFF5E4".split("-").map((a) => "#" + a);
let newTone02 = "967E76-D7C0AE-EEE3CB-B7C4CF".split("-").map((a) => "#" + a);
let newTone03 = "EEF1FF-D2DAFF-AAC4FF-B1B2FF".split("-").map((a) => "#" + a);
let newTone04 = "E38B29-F1A661-FFD8A9-FDEEDC".split("-").map((a) => "#" + a);
let newTone05 = "FFC3A1-F0997D-D3756B-A75D5D".split("-").map((a) => "#" + a);
let newTone06 = "374259-545B77-5C8984-F2D8D8".split("-").map((a) => "#" + a);

let newTone07 = "675D50-ABC4AA-F3DEBA-A9907E".split("-").map((a) => "#" + a);
let newTone08 = "F5F5F5-E8E2E2-F99417-5D3891".split("-").map((a) => "#" + a);
let newTone09 = "EAE0DA-F7F5EB-A0C3D2-EAC7C7".split("-").map((a) => "#" + a);
let newTone10 = "FFED00-16FF00-0F6292-202020".split("-").map((a) => "#" + a);
let newTone11 = "82954B-BABD42-EFD345-FFEF82".split("-").map((a) => "#" + a);
let newTone12 = "146C94-19A7CE-B0DAFF-FEFF86".split("-").map((a) => "#" + a);

function setup() {
  color_sel2 = random([
    newTone01,
    newTone02,
    newTone03,
    newTone04,
    newTone05,
    newTone06,
    newTone07,
    newTone08,
    newTone09,
    newTone10,
    newTone11,
    newTone12,
  ]);

  frameRate(1);
  // pixelDensity(4);
  randomSeed(seed);
  mySize = 500;
  margin = mySize / 100;
  createCanvas(mySize, mySize);
  background(random(colors0));
  // angleMode(DEGREES);
  // makeFilter();
  image(overAllTexture, 0, 0);
}

function draw() {
  // background(random(colors0));
  rectMode(CENTER);
  push();
  translate(width / 2, height / 2);
  drawCircleRecursive(0, 0, width / 3.5, height / 3.5, 8);
  pop();

  noLoop();

  rectMode(CORNERS);
  strokeWeight(random(0.1, 0.5));
  stroke(str(random(colors0)) + "0d");
  noFill();
  drawingContext.setLineDash([1, 2, 1, 3, 2, 1, 2, 4]);
  drawOverPattern();

  //frame
  drawingContext.setLineDash([]);
  noFill();
  stroke("#202020");
  strokeWeight(margin);
  rect(0, 0, width, height);
}

function drawCircleRecursive(x, y, h, w, depth) {
  noStroke();
  fill(random(color_sel2));
  strokeWeight(0.5);
  let rio = 0.995;
  for (let i = 0; i < 4; i++) {
    push();
    rotate(random(TAU));
    translate(x + random(-2, 2), y + random(-2, 2));
    ellipse(0, 0, h * rio, w * rio, depth);
    pop();
  }
  // rect(x, y, h * rio, w * rio, depth);
  if (depth > 0) {
    let offx = width / 2 - (w / 2) * rio;
    let offy = height / 2 - (w / 2) * rio;
    push();
    // translate(-offx/2, -offy/2);
    drawCircleRecursive(x, y, (w / 2) * rio, (h / 2) * rio, depth - 1);
    drawCircleRecursive(x + w / 2, y, (w / 2) * rio, (h / 2) * rio, depth - 1);
    drawCircleRecursive(
      x + w / 2,
      y + h / 2,
      (w / 2) * rio,
      (h / 2) * rio,
      depth - 1,
    );
    drawCircleRecursive(x, y + h / 2, (w / 2) * rio, (h / 2) * rio, depth - 1);
    pop();
  }
}
