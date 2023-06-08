// グローバル変数を定義するときは、変数名の頭に"作者名_"を追加
let kkeeth_capture = 0;

function kkeeth_setup() {
  cnv = createCanvas(windowWidth, windowHeight); // 描画領域の大きさは、必要に応じて変更
  cnv.position(
    abs(windowWidth - camImg.width) / 2,
    abs(windowHeight - camImg.height) / 2,
  );
  pixelDensity(1);
}

function kkeeth_draw() {
  push();

  // let step = map(mouseX, 0, width, 1, 10);
  let step = 8;

  if (camImg) {
    let g = camImg.get(0, 0, camImg.width / 2, height);
    push();
    translate(camImg.width, 0);
    scale(-1, 1);
    image(g, 0, 0);
    pop();

    let g2 = get(0, 0, width / 2, height);
    image(g2, -step, 0, width / 2, height);
  }
  pop();
}
