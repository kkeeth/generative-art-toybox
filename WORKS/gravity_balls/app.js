let vecLocation = [];
let vecVelocity = [];
let vecAccel = [];
let randomColor = [];
let randomBallSize = [];
let itemCount = 20;

function setup() {
	createCanvas(w = 600, h = 600);
	colorMode(HSB);
	// vecLocation = createVector(w / 2, h / 2);
	for (let i = 0; i < itemCount; i++) {
		vecLocation[i] = createVector(random(w), random(h / 2));
  	vecVelocity[i] = createVector(random(2, 5), random(2, 8));
	  vecAccel[i] = createVector(0, 0.5);
		randomColor[i] = random(200);
		randomBallSize[i] = random(20, 80);
	}
}

function draw() {
	background("#efefef");
	noStroke();
	for (let i = 0; i < itemCount; i++) {
		fill(randomColor[i], 100, 100, 0.7);
		ellipse(vecLocation[i].x, vecLocation[i].y, randomBallSize[i], randomBallSize[i]);

		vecVelocity[i].add(vecAccel[i]);
		vecLocation[i].add(vecVelocity[i]);

		if (vecLocation[i].x > w || vecLocation[i].x < 0) {
			vecVelocity[i].x *= -1;
		}
		if (vecLocation[i].y > h || vecLocation[i].y < 0) {
			vecVelocity[i].y *= -1;
		}
	}
}