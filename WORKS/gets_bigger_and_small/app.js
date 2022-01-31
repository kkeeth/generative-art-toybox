function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	angleMode(DEGREES);
	colorMode(HSB);
}

function draw() {
	background(255);
	translate(-width / 2, -height / 2);
	noStroke();
	for (let i = 0; i < 15; i++) {
		rotateX(4);
		for (let j = 0; j < width; j += 200) {
			fill(cos(frameCount + j) * 180, 60, 90);
			ellipse(j, i * 70 + 40, sin(frameCount + i * 15 + j) * 180, 80);
		}
	}
}