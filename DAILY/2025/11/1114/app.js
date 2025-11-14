let tetrahedrons = [];
let colors = [];
let particles = [];
let rotationX = 0;
let rotationY = 0;

function setup() {
  createCanvas((W = min(windowWidth, windowHeight) - 50), W, WEBGL);

  // 3層の正四面体を生成（各面の中心を結んで次の層を作る）
  let baseSize = W / 4;
  let currentTet = createTetrahedron(baseSize);

  // 色設定: 青 → 赤 → 緑
  colors = [
    color(50, 100, 200),   // 青
    color(200, 50, 100),   // 赤
    color(50, 200, 100)    // 緑
  ];

  // 3層分の正四面体を生成
  for (let i = 0; i < 3; i++) {
    let edges = getEdges(currentTet);
    tetrahedrons.push({
      vertices: currentTet,
      edges: edges,
      color: colors[i],
      layer: i
    });

    // 次の層は現在の層の各面の中心を結んで作る
    if (i < 2) {
      currentTet = createDualTetrahedron(currentTet);
    }
  }
}

function draw() {
  background(250);

  // ライティング
  ambientLight(100);
  pointLight(255, 255, 255, 200, -200, 200);

  // 回転
  rotationX += 0.003;
  rotationY += 0.005;
  rotateX(rotationX);
  rotateY(rotationY);

  // 各層の正四面体のエッジを点描で描画
  for (let i = 0; i < tetrahedrons.length; i++) {
    let tet = tetrahedrons[i];
    let alpha = map(i, 0, tetrahedrons.length - 1, 200, 150);
    let edgeColor = color(red(tet.color), green(tet.color), blue(tet.color), alpha);
    drawEdgesStippled(tet.vertices, edgeColor, 60);
  }

  // 各層の頂点からパーティクルを生成（大量に）
  if (frameCount % 3 === 0) {
    for (let tet of tetrahedrons) {
      // 各頂点から複数のパーティクルを生成
      for (let vertex of tet.vertices) {
        if (random() < 0.3) {
          let edge = random(tet.edges.filter(e =>
            e[0].equals(vertex) || e[1].equals(vertex)
          ));

          createParticle(vertex, edge, tet.color, tet.layer);
        }
      }
    }
  }

  // パーティクルの更新と描画
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();

    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

// 正四面体の頂点を生成（立方体の交互の頂点）
function createTetrahedron(size) {
  return [
    createVector(size, size, size),
    createVector(size, -size, -size),
    createVector(-size, size, -size),
    createVector(-size, -size, size)
  ];
}

// 正四面体のエッジを取得
function getEdges(vertices) {
  return [
    [vertices[0], vertices[1]],
    [vertices[0], vertices[2]],
    [vertices[0], vertices[3]],
    [vertices[1], vertices[2]],
    [vertices[1], vertices[3]],
    [vertices[2], vertices[3]]
  ];
}

// 双対な正四面体を生成（各面の中心が頂点）
function createDualTetrahedron(vertices) {
  let faces = [
    [0, 1, 2], // 面1
    [0, 1, 3], // 面2
    [0, 2, 3], // 面3
    [1, 2, 3]  // 面4
  ];

  let dual = [];
  for (let face of faces) {
    let center = createVector(0, 0, 0);
    for (let i of face) {
      center.add(vertices[i]);
    }
    center.div(3);
    dual.push(center);
  }
  return dual;
}

// パーティクルを生成
function createParticle(startVertex, edge, col, layer) {
  particles.push({
    pos: startVertex.copy(),
    edge: edge,
    edgeProgress: 0,
    state: 'ALONG_EDGE', // 'ALONG_EDGE' or 'TO_CENTER'
    color: col,
    layer: layer,
    life: 255,
    size: 5 + layer * 0.5,

    update: function() {
      if (this.state === 'ALONG_EDGE') {
        // エッジに沿って移動
        this.edgeProgress += 0.02;

        if (this.edgeProgress >= 1) {
          // エッジの終端に到達、中心に向かう状態に移行
          this.state = 'TO_CENTER';
          this.edgeProgress = 1;
        }

        // エッジに沿った位置を計算
        let start = this.edge[0];
        let end = this.edge[1];
        this.pos = p5.Vector.lerp(start, end, this.edgeProgress);

      } else if (this.state === 'TO_CENTER') {
        // 中心に向かって移動
        let toCenter = p5.Vector.mult(this.pos, -1);
        toCenter.normalize();
        toCenter.mult(2);

        this.pos.add(toCenter);
        this.life -= 5;

        // 中心に近づいたら消滅
        if (this.pos.mag() < 5) {
          this.life = 0;
        }
      }
    },

    display: function() {
      push();
      strokeWeight(this.size);
      stroke(
        red(this.color),
        green(this.color),
        blue(this.color),
        this.life
      );
      point(this.pos.x, this.pos.y, this.pos.z);
      pop();
    },

    isDead: function() {
      return this.life <= 0;
    }
  });
}

// エッジを点描で描画（静的）
function drawEdgesStippled(vertices, col, numPoints) {
  let edges = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [1, 3], [2, 3]
  ];

  strokeWeight(3);
  stroke(col);

  for (let edge of edges) {
    let v0 = vertices[edge[0]];
    let v1 = vertices[edge[1]];

    for (let i = 0; i < numPoints; i++) {
      let t = i / numPoints;
      let x = lerp(v0.x, v1.x, t);
      let y = lerp(v0.y, v1.y, t);
      let z = lerp(v0.z, v1.z, t);
      point(x, y, z);
    }
  }
}

function keyPressed() {
  if (key === 's') {
    saveGif(`tetrahedron-dual-${round(new Date().getTime() / 100000)}`, 5);
  }

  if (key === 'c') {
    saveCanvas(`tetrahedron-dual-${round(new Date().getTime() / 100000)}`, 'jpeg');
  }
}
