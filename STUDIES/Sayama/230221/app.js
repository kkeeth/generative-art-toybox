const URL = "https://coolors.co/03011e-6a615c-e9d9cd-fd3a3a";
let COLS;
let BGCOL;

let penArr = [];
let UIGra;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // frameRate(60);

  UIGra = createGraphics(width, height);
  UIGra.noStroke();
  UIGra.fill(200, 0, 0);

  ini();
}

function ini() {
  COLS = createCols(URL);
  COLS = shuffle(COLS);
  BGCOL = COLS[0];
  COLS.shift();

  const numListArr = [
    [2, 4],
    [2, 4, 8],
    [2, 6, 24, 36],
    [4, 6, 8],
    [2, 4, 6],
    [3, 9, 5],
  ];
  const MirrorNum = random(numListArr);
  const penNum = int(random(2, 5));
  const lineAngleAdjust = random([PI / 4, PI / 2, PI / 3]);
  const inputThreshDistance = 10;

  penArr = [];

  for (let i = 0; i < penNum; i++) {
    const s = min(width, height);
    let num = random(MirrorNum);
    let centerX = s * (i / penNum) * 0.4;
    let spanX = (s * 0.5) / penNum;
    let sx = centerX + random(-0.5, 0.5) * spanX;
    let sy = 0;
    let rad = PI * 0.5;
    let speed = random(0.5, 1);
    let flipX = random() > 0.5 ? true : false;
    let flipY = random() > 0.5 ? true : false;
    let lineCol = random(COLS);

    penArr.push(
      new MirrorPen(
        num,
        sx,
        sy,
        rad,
        lineAngleAdjust,
        inputThreshDistance,
        speed,
        flipX,
        flipY,
        lineCol,
      ),
    );
  }
}

function draw() {
  background(BGCOL);
  UIGra.clear();

  //リセット
  //if(frameCount % 180 == 0)ini();

  //描画の更新
  if (mouseIsPressed) for (const i of penArr) i.draw();
  for (const i of penArr) i.drawUI();

  //バッファの描画
  for (const i of penArr) image(i.gra, 0, 0);
  image(UIGra, 0, 0);
}

function mouseReleased() {
  for (const i of penArr) i.inputReset();
}

function createCols(_url) {
  let slash_index = _url.lastIndexOf("/");
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split("-");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = "#" + arr[i];
  }
  return arr;
}
