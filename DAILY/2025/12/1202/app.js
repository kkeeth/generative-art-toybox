// 中心から放射状に広がる回転する粒子システム
let particles = [];
let numParticles = 1200;
let centerX, centerY;
let globalRotation = 0;
let breathPhase = 0;

// カラーパレット
const colors = [
  [240, 100, 120], // ピンク
  [100, 150, 240], // ブルー
  [120, 220, 150], // グリーン
  [250, 200, 80], // イエロー
  [180, 120, 240], // パープル
  [240, 140, 80], // オレンジ
  [220, 80, 180], // マゼンタ
  [80, 220, 220], // シアン
];

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) * 0.7), W);
  centerX = width / 2;
  centerY = height / 2;

  // パーティクルの初期化
  for (let i = 0; i < numParticles; i++) {
    particles.push(createParticle());
  }
}

function createParticle() {
  return {
    pos: createVector(centerX, centerY),
    vel: createVector(0, 0),
    distFromCenter: random(20, min(width, height) * 0.9),
    baseAngle: random(TWO_PI), // 各パーティクルが独自の基本角度を持つ
    angleOffset: random(-0.3, 0.3),
    spiralTightness: 0.1 + random(-0.02, 0.02),
    breathOffset: random(TWO_PI),
    width: W + random(-50, 50),
    color: random(colors),
    maxSpeed: 2 + random(1),
    baseSize: random(1.5, 3.5),
    trail: [],
    noiseOffset: random(1000),
    phase: random(TWO_PI),
  };
}

function draw() {
  // 半透明の背景で美しい残像効果
  fill(5, 5, 10, 30);
  noStroke();
  rect(0, 0, width, height);

  // グローバル回転と呼吸を更新
  globalRotation += 0.005;
  breathPhase += 0.02;

  // 中心点を描画
  noStroke();
  for (let r = 40; r > 0; r -= 5) {
    let alpha = map(r, 0, 40, 120, 0);
    fill(255, 255, 255, alpha);
    ellipse(centerX, centerY, r * 2, r * 2);
  }

  // パーティクルを更新・描画
  for (let p of particles) {
    // 呼吸効果
    let breathScale = 1 + sin(breathPhase + p.breathOffset) * 0.3;
    let effectiveDist = p.distFromCenter * breathScale;

    // スパイラル効果
    let spiralAngle = effectiveDist * p.spiralTightness;
    let totalAngle = p.baseAngle + globalRotation + spiralAngle;

    // 目標位置を計算
    let targetX = centerX + cos(totalAngle) * effectiveDist;
    let targetY = centerY + sin(totalAngle) * effectiveDist;

    // 角度オフセットとノイズを適用
    let offsetAngle = totalAngle + p.angleOffset;
    let noiseInfluence = noise(p.noiseOffset + frameCount * 0.01) * 20 - 10;

    targetX += cos(offsetAngle) * (p.width * 0.9 + noiseInfluence);
    targetY += sin(offsetAngle) * (p.width * 0.9 + noiseInfluence);

    let targetPos = createVector(targetX, targetY);

    // 目標位置に向かって移動
    let toTarget = p5.Vector.sub(targetPos, p.pos);
    toTarget.limit(p.maxSpeed);
    p.vel.lerp(toTarget, 0.1);
    p.pos.add(p.vel);

    // 外側に向かって移動
    p.distFromCenter += 0.6 + sin(frameCount * 0.02 + p.phase) * 0.4;

    // 外側に達したら新しいパーティクルとして再生成
    if (p.distFromCenter > min(width, height) * 0.95) {
      Object.assign(p, createParticle());
    }

    // 軌跡を保存
    p.trail.push(p.pos.copy());
    if (p.trail.length > 20) {
      p.trail.shift();
    }

    // 軌跡を描画
    if (p.trail.length >= 2) {
      noFill();
      for (let i = 0; i < p.trail.length - 1; i++) {
        let alpha = map(i, 0, p.trail.length, 0, 180);
        let weight = map(i, 0, p.trail.length, 0.3, 2);
        stroke(p.color[0], p.color[1], p.color[2], alpha);
        strokeWeight(weight);
        line(p.trail[i].x, p.trail[i].y, p.trail[i + 1].x, p.trail[i + 1].y);
      }
    }

    // パーティクル本体
    noStroke();
    fill(p.color[0], p.color[1], p.color[2], 220);
    ellipse(p.pos.x, p.pos.y, p.baseSize, p.baseSize);

    // 中心に近い粒子は明るく
    let distToCenter = dist(p.pos.x, p.pos.y, centerX, centerY);
    if (distToCenter < 100) {
      let glow = map(distToCenter, 0, 100, 100, 0);
      fill(p.color[0], p.color[1], p.color[2], glow);
      ellipse(p.pos.x, p.pos.y, p.baseSize * 2, p.baseSize * 2);
    }
  }

  // UI表示
  displayInfo();
}

function displayInfo() {
  fill(255, 255, 255, 200);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Particles: ${numParticles}`, 10, 10);
  text('Keys', 10, 40);
  text('1/2: Particles ±200', 10, 60);
  text('R: Reset', 10, 80);
  text('S: Save GIF (5 sec)', 10, 100);
  text('C: Save canvas', 10, 120);
}

function adjustParticles() {
  const diff = numParticles - particles.length;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      particles.push(createParticle());
    }
  } else if (diff < 0) {
    particles = particles.slice(0, numParticles);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}

function keyPressed() {
  if (key === '1') {
    numParticles = max(500, numParticles - 200);
    adjustParticles();
  }
  if (key === '2') {
    numParticles = min(5000, numParticles + 200);
    adjustParticles();
  }
  if (key === 'r' || key === 'R') {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(createParticle());
    }
    globalRotation = 0;
    breathPhase = 0;
  }
  if (key === 's' || key === 'S') {
    saveGif(`spiral-particles-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c' || key === 'C') {
    saveCanvas(
      `spiral-particles-${round(new Date().getTime() / 100000)}`,
      'jpeg',
    );
  }
}
