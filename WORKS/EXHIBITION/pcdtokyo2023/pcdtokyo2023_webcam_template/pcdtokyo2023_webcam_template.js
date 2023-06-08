const dispWidth = 1920;
const dispHeight = 1080;

var canvas;
var capture;
var camImg;

var selectedWorkNum = "1";
var keyChangedFlag = true;

function setup() {
  cnv = createCanvas(dispWidth, dispHeight);

  let constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720,
      },
    },
    audio: false,
  };
  capture = createCapture(constraints, function (stream) {
    console.log(stream);
  });
  capture.hide();
}

// 数字キーを押すと作品が切り替わる
function draw() {
  camImg = capture.get();

  switch (selectedWorkNum) {
    case "1":
      if (keyChangedFlag) {
        example1_setup();
        keyChangedFlag = false;
      }
      example1_draw();
      break;
    case "2":
      if (keyChangedFlag) {
        example2_setup();
        keyChangedFlag = false;
      }
      example2_draw();
      break;
    case "3":
      break;
    case "4":
      break;
    case "5":
      break;
    case "6":
      break;
    case "7":
      break;
    default:
      if (keyChangedFlag) {
        kkeeth_setup();
        keyChangedFlag = false;
      }
      kkeeth_draw();
      break;
  }
}

function keyTyped() {
  fullscreen(true);
  switch (key) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "0":
      selectedWorkNum = key;
  }
  keyChangedFlag = true;
}
