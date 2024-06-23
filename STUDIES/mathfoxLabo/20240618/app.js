/*
たとえばお魚でやりたいなら
ポリゴンを作って
同じように線を伸ばして
正規化すればいい
文字メッシュで試したらいいと思う
って
失敗したばっかりだったわ
うーむ
どうしたもんかな...
あれはやり方を間違えただけじゃないかしら
うーん
まあいいか

平面上にメッシュを用意して同じ要領で貼り付ければ
同じことができると思う
あとは頂点色とかで適当に装飾すればいいのでは
ないかと
透明度のは
どうしたって無理ですから
ね

球面上の点をランダムに取得しないといけないのか
んー...
*/

/*
detailedArrow
三角の割合
と
サイズw,h
と
太さの割合
たとえば太さの割合が0.5なら半分の長さ
三角が0.7ならさきっちょ0.3でちょっと短め
直角二等辺にしたい場合は
w:hを10:3にしたうえで三角の割合を0.7にすればいい
*/

const fish =
  'M 0.938 -0.025 Q 0.700 0.191 0.354 0.216 Q 0.131 0.401 -0.154 0.369 Q -0.014 0.291 0.015 0.145 Q -0.125 0.035 -0.388 0.017 Q -0.519 0.038 -0.623 0.113 Q -0.726 0.189 -0.895 0.182 Q -0.729 0.117 -0.729 0.009 Q -0.729 -0.099 -0.912 -0.180 Q -0.654 -0.145 -0.509 -0.074 Q -0.363 -0.003 -0.172 -0.149 Q -0.054 -0.238 0.029 -0.257 Q 0.028 -0.385 -0.097 -0.476 Q 0.188 -0.450 0.378 -0.294 Q 0.709 -0.216 0.938 -0.025'

const MAX_RADIUS = 400

const units = []

let info

function setup() {
  createCanvas(640, 640, WEBGL)
  pixelDensity(1)

  //const R = 300;

  const fishContours = getContoursFromSVG({
    svgData: fish,
    scaleFactor: 40,
    bezierDetail2: 8,
  })
  const fishResult = cyclesToCycles(fishContours)
  const geom = createBoardMeshFromCycles({
    result: fishResult,
    thick: 3,
  })

  /*
  const geom = createPlaneArrowMesh({
    w:32, h:20, z:R, triangleRatio:0.55, widthRatio:0.4, detail:20
  });
  */
  for (const v of geom.vertices) {
    const u = (v.x + 40) / 80
    geom.vertexColors.push(u, u * 0.5 + 0.5, 1, 1)
  }

  for (const v of geom.vertices) {
    const tmp = v.z
    v.z = -v.y
    v.y = tmp
    //v.normalize().mult(MAX_RADIUS);
  }

  geom.computeNormals()
  this._renderer.createBuffers('fishBoard', geom)
  noStroke()
  /*
  fs.t = createVector(1,0,0);
  fs.n = createVector(0,1,0);
  fs.b = createVector(0,0,1);
*/
  // 進む場合、nの周りにt,bを回転させる
  // 回転角がangleの場合angle*Rだけ進む。逆に言うと速度vの場合
  // v/Rだけ回転させるわけ。
  // そのあと進行方向を変える場合、bのまわりにt,nを回転させるね
  // noise-0.5だけ...？
  // 描画の際は「t,n,b」のapplyMatrixでOK.

  for (let k = 0; k < 70; k++) {
    units.push(createUnit())
  }

  info = createGraphics(width, height)
  info.textSize(16)
  info.textStyle(ITALIC)
  info.textAlign(LEFT, TOP)
  info.noStroke()
  info.fill(255)
}

function draw() {
  orbitControl()
  background(0)
  lights()
  fill(255)
  specularMaterial(20)

  for (const u of units) {
    u.updateUnit()
    u.drawUnit(this._renderer)
  }

  //fill(128);
  //sphere(299.9,48);
  /*
  texture(img);
  push();
  applyMatrix(
    fs.t.x, fs.t.y, fs.t.z, 0,
    fs.n.x, fs.n.y, fs.n.z, 0,
    fs.b.x, fs.b.y, fs.b.z, 0,
    0,0,0,1
  );
  this._renderer.drawBuffers("sphereRect");
  pop();
  fill(128);
  sphere(99.9,48);

  rotateByAxis(fs.t, fs.n, 0.01);
  rotateByAxis(fs.b, fs.n, 0.01);

  const diff = 0.15*(noise(frameCount/20)-0.5);
  rotateByAxis(fs.t, fs.b, diff);
  rotateByAxis(fs.n, fs.b, diff);
  */
  info.clear()
  info.text(frameRate().toFixed(3), 5, 5)
  push()
  noLights()
  camera(0, 0, 1, 0, 0, 0, 0, 1, 0)
  ortho(-1, 1, -1, 1, 0, 1)
  texture(info)
  plane(2)
  pop()
}

function rotateByAxis(v, axis, angle = 0) {
  const na = Math.hypot(axis.x, axis.y, axis.z)
  const a = [axis.x / na, axis.y / na, axis.z / na]
  const dp = a[0] * v.x + a[1] * v.y + a[2] * v.z
  const w0 = [a[0] * dp, a[1] * dp, a[2] * dp]
  const c = Math.cos(angle)
  const w1 = [c * (v.x - w0[0]), c * (v.y - w0[1]), c * (v.z - w0[2])]
  const s = Math.sin(angle)
  const w2 = [
    s * (a[1] * v.z - a[2] * v.y),
    s * (a[2] * v.x - a[0] * v.z),
    s * (a[0] * v.y - a[1] * v.x),
  ]
  v.set(w0[0] + w1[0] + w2[0], w0[1] + w1[1] + w2[1], w0[2] + w1[2] + w2[2])
}

function createUnit() {
  return new FlowUnit({
    x: random(0.1, 0.9) * width,
    y: random(0.1, 0.9) * height,
    direction: random(TAU),
    moveLength: min(width, height) * random(0.1, 0.3),
    velocity: random(2.5, 5.5),
    scaleFactor: random(0.5, 1),
  })
}

// durationの間、cp0,cp1,cp2のquadBezierにしたがって動く
// かかる時間はdurationにするが
// そのうち曲線の長さと速度で最適化したいところ
class FlowUnit {
  constructor(params = {}) {
    const {
      x = width / 2,
      y = height / 2,
      direction = 0,
      moveLength = min(width, height) * 0.3,
      velocity = 4,
      scaleFactor = 1,
    } = params
    this.position = createVector(x, y)
    this.prevPosition = this.position.copy()
    this.direction = direction
    this.prevDirection = direction
    this.cp0 = createVector(x, y)
    this.cp1 = createVector(
      x + moveLength * cos(direction),
      y + moveLength * sin(direction),
    )
    this.cp2 = createVector(
      x - moveLength * sin(direction),
      y + moveLength * cos(direction),
    )
    this.moveLength = moveLength
    this.velocity = velocity

    this.progressTime = 0 // 時間ベース
    this.currentTime = millis()
    // 初期間隔
    this.duration =
      quadraticCurveLength(
        this.cp0.x,
        this.cp0.y,
        this.cp1.x,
        this.cp1.y,
        this.cp2.x,
        this.cp2.y,
      ) / this.velocity

    const tVec = p5.Vector.random3D()
    this.fs = getRandomFS(tVec)

    this.scaleFactor = scaleFactor

    this.sphereRadius = MAX_RADIUS * this.scaleFactor
  }
  updateUnit() {
    //const t = this.progressCount / this.duration;
    const t = this.progressTime / this.duration
    const c0 = (1 - t) * (1 - t)
    const c1 = 2 * t * (1 - t)
    const c2 = t * t
    this.prevPosition.set(this.position)
    this.position.set(
      c0 * this.cp0.x + c1 * this.cp1.x + c2 * this.cp2.x,
      c0 * this.cp0.y + c1 * this.cp1.y + c2 * this.cp2.y,
    )
    this.prevDirection = this.direction
    this.direction = atan2(
      this.position.y - this.prevPosition.y,
      this.position.x - this.prevPosition.x,
    )

    this.updateFS()

    //this.progressCount++;
    const ct = millis()
    this.progressTime += ((ct - this.currentTime) * 60) / 1000
    this.currentTime = ct
    /*
    if(this.progressCount === this.duration){
      //this.properFrameCount = 0;
      this.resetting();
    }
    */
    if (this.progressTime > this.duration) {
      this.progressTime -= this.duration
      this.resetting()
    }
  }
  updateFS() {
    const distanceDiff = this.velocity / this.sphereRadius
    rotateByAxis(this.fs.t, this.fs.n, distanceDiff)
    rotateByAxis(this.fs.b, this.fs.n, distanceDiff)

    const angleDiff = this.direction - this.prevDirection
    rotateByAxis(this.fs.t, this.fs.b, angleDiff)
    rotateByAxis(this.fs.n, this.fs.b, angleDiff)
  }
  drawUnit(_renderer) {
    push()
    noLights()
    applyMatrix(
      this.fs.t.x,
      this.fs.t.y,
      this.fs.t.z,
      0,
      this.fs.n.x,
      this.fs.n.y,
      this.fs.n.z,
      0,
      this.fs.b.x,
      this.fs.b.y,
      this.fs.b.z,
      0,
      0,
      0,
      0,
      1,
    )
    translate(0, 0, this.sphereRadius)
    _renderer.drawBuffersScaled(
      'fishBoard',
      this.scaleFactor,
      this.scaleFactor,
      this.scaleFactor,
    )
    pop()
  }
  resetting() {
    // cp0はcp2
    // cp1はもとのcp2に対してもとのcp1の対蹠点
    // cp2はcp0→cp1に対して角度を一定の範囲で傾ける
    this.cp0.set(this.cp2)
    this.cp1.set(2 * this.cp2.x - this.cp1.x, 2 * this.cp2.y - this.cp1.y)
    const directionVector = this.cp1.copy().sub(this.cp0).normalize()
    const l = this.moveLength * random(0.9, 1.1)
    const angle = random(PI / 6, (PI * 5) / 6) * random([1, -1])
    directionVector.mult(l).rotate(angle)
    this.cp2.set(directionVector.add(this.cp1))

    // 大体100～300
    const ql = quadraticCurveLength(
      this.cp0.x,
      this.cp0.y,
      this.cp1.x,
      this.cp1.y,
      this.cp2.x,
      this.cp2.y,
    )
    // たとえば速度が4ならduration=ql/4くらいにするとかそういうの
    //this.duration = floor(ql/this.velocity);
    this.duration = ql / this.velocity
  }
}

// 2次ベジエの長さ
// https://openprocessing.org/sketch/1969811
// Zenn:https://zenn.dev/articles/c84067bfbd616d/edit

function quadraticCurveLength(a0, b0, a1, b1, a2, b2, t0 = 0, t1 = 1) {
  return quadraticCurveLengthGeneral(a0, b0, 0, a1, b1, 0, a2, b2, 0, t0, t1)
}

// 3次元version.
function quadraticCurveLengthGeneral(
  a0,
  b0,
  c0,
  a1,
  b1,
  c1,
  a2,
  b2,
  c2,
  t0 = 0,
  t1 = 1,
) {
  const p0 = new p5.Vector(a0, b0, c0)
  const p1 = new p5.Vector(a1, b1, c1)
  const p2 = new p5.Vector(a2, b2, c2)
  const q0 = p5.Vector.sub(p0, p1)
  const q1 = p5.Vector.add(p0, p2).sub(p1).sub(p1)
  const a = q1.magSq()
  const b = q1.dot(q0)
  const c = q0.magSq()
  const d = a * c - b * b
  const g = (x) => Math.log(x + Math.sqrt(x * x + 1)) + x * Math.sqrt(x * x + 1)

  if (a > 0 && d > 0) {
    return (
      (d * (g((a * t1 - b) / Math.sqrt(d)) - g((a * t0 - b) / Math.sqrt(d)))) /
      (a * Math.sqrt(a))
    )
  }
  if (a > 0) {
    return (
      ((a * t1 - b) * Math.abs(a * t1 - b) -
        (a * t0 - b) * Math.abs(a * t0 - b)) /
      (a * Math.sqrt(a))
    )
  }
  return 2 * Math.sqrt(c) * (t1 - t0)
}

// 0でないベクトルvからt:v.normalize()であるような系を作るだけ
// そんだけ
// tがz軸でnとbがxとyですね
// 割と便利だと思う。こういう関数も必要ということ。
function getRandomFS(v) {
  const tang = v.copy().normalize()
  const nVec = createVector()
  if (Math.abs(tang.x) > 0.01) {
    nVec.set(-tang.y, tang.x, 0).normalize()
  } else {
    nVec.set(0, -tang.z, tang.y).normalize()
  }
  const bVec = tang.cross(nVec).normalize()
  const angle = Math.random() * 2 * Math.PI
  const resultNVec = createVector(
    Math.cos(angle) * nVec.x + Math.sin(angle) * bVec.x,
    Math.cos(angle) * nVec.y + Math.sin(angle) * bVec.y,
    Math.cos(angle) * nVec.z + Math.sin(angle) * bVec.z,
  )
  const resultBVec = createVector(
    -Math.sin(angle) * nVec.x + Math.cos(angle) * bVec.x,
    -Math.sin(angle) * nVec.y + Math.cos(angle) * bVec.y,
    -Math.sin(angle) * nVec.z + Math.cos(angle) * bVec.z,
  )
  return { t: tang, n: resultNVec, b: resultBVec }
}

function createBoardArrowMesh(params = {}) {
  const {
    w = 80,
    h = 40,
    thick = 10,
    triangleRatio = 0.5,
    widthRatio = 0.5,
    detail = 20,
    z = 0,
  } = params
  const x1 = -w / 2
  const x2 = -w / 2 + w * triangleRatio
  const x3 = w / 2
  const y1 = -h / 2
  const y2 = -h / 2 + h * (1 - widthRatio) * 0.5
  const y3 = 0
  const y4 = -h / 2 + h * (1 + widthRatio) * 0.5
  const y5 = h / 2
  const z1 = z + thick / 2
  const z2 = z - thick / 2
  const uVecs = [
    createVector(x1, y2, z1),
    createVector(x1, y4, z1),
    createVector(x2, y4, z1),
    createVector(x2, y5, z1),
    createVector(x3, y3, z1),
    createVector(x2, y1, z1),
    createVector(x2, y2, z1),
  ]
  const lVecs = [
    createVector(x1, y2, z2),
    createVector(x1, y4, z2),
    createVector(x2, y4, z2),
    createVector(x2, y5, z2),
    createVector(x3, y3, z2),
    createVector(x2, y1, z2),
    createVector(x2, y2, z2),
  ]
  const upper = createPlaneArrowMesh({
    w: w,
    h: h,
    triangleRatio: triangleRatio,
    widthRatio: widthRatio,
    detail: detail,
    z: z + thick / 2,
  })
  const lower = createPlaneArrowMesh({
    w: w,
    h: h,
    triangleRatio: triangleRatio,
    widthRatio: widthRatio,
    detail: detail,
    z: z - thick / 2,
  })
  const geom = upper
  const indexOffset = geom.vertices.length
  for (let i = 0; i < lower.vertices.length; i++) {
    geom.vertices.push(lower.vertices[i])
    geom.vertexNormals.push(lower.vertexNormals[i].mult(-1))
  }
  for (const f of lower.faces) {
    geom.faces.push([
      indexOffset + f[0],
      indexOffset + f[2],
      indexOffset + f[1],
    ])
  }

  const geoms = []
  for (let i = 0; i < 7; i++) {
    geoms.push(
      createDetailedRhombusMesh({
        p: uVecs[i],
        q: uVecs[(i + 1) % 7],
        r: lVecs[i],
        detail: detail,
      }),
    )
  }
  for (const eachGeom of geoms) {
    const offset = geom.vertices.length
    geom.vertices.push(...eachGeom.vertices)
    geom.vertexNormals.push(...eachGeom.vertexNormals)
    for (const f of eachGeom.faces) {
      geom.faces.push([offset + f[0], offset + f[1], offset + f[2]])
    }
  }
  return geom
}

function createPlaneArrowMesh(params = {}) {
  const {
    w = 80,
    h = 40,
    triangleRatio = 0.5,
    widthRatio = 0.5,
    detail = 20,
    z = 0,
  } = params
  const geom = createDetailedRhombusMesh({
    p: createVector(-w / 2, -h / 2 + h * (1 - widthRatio) * 0.5, z),
    q: createVector(
      -w / 2 + w * triangleRatio,
      -h / 2 + h * (1 - widthRatio) * 0.5,
      z,
    ),
    r: createVector(-w / 2, -h / 2 + h * (1 + widthRatio) * 0.5, z),
    detail: detail,
  })
  const arrowHead = createDetailedTriangleMesh({
    p: createVector(-w / 2 + w * triangleRatio, -h / 2, z),
    q: createVector(w / 2, 0, z),
    r: createVector(-w / 2 + w * triangleRatio, h / 2, z),
    detail: detail,
  })
  const indexOffset = geom.vertices.length
  geom.vertices.push(...arrowHead.vertices)
  geom.vertexNormals.push(...arrowHead.vertexNormals)
  for (const f of arrowHead.faces) {
    geom.faces.push([
      f[0] + indexOffset,
      f[1] + indexOffset,
      f[2] + indexOffset,
    ])
  }
  return geom
}

// ひしがた
// p,q,r,p+(q-p)+(r-p)のひし形
function createDetailedRhombusMesh(params = {}) {
  const {
    p = createVector(),
    q = createVector(1, 0, 0),
    r = createVector(0, 1, 0),
    detail = 20,
  } = params
  const geom = new p5.Geometry()
  const pq = q.copy().sub(p)
  const pr = r.copy().sub(p)
  const n = pq.cross(pr).normalize()
  for (let i = 0; i <= detail; i++) {
    const ratioY = i / detail
    for (let k = 0; k <= detail; k++) {
      const ratioX = k / detail
      geom.vertices.push(
        createVector(
          p.x + pq.x * ratioX + pr.x * ratioY,
          p.y + pq.y * ratioX + pr.y * ratioY,
          p.z + pq.z * ratioX + pr.z * ratioY,
        ),
      )
      geom.vertexNormals.push(n)
    }
  }
  for (let i = 0; i < detail; i++) {
    for (let k = 0; k < detail; k++) {
      const lu = (detail + 1) * i + k
      const ru = (detail + 1) * i + k + 1
      const ld = (detail + 1) * (i + 1) + k
      const rd = (detail + 1) * (i + 1) + k + 1
      geom.faces.push([lu, ru, rd], [lu, rd, ld])
    }
  }
  return geom
}

// p,q,rで時計回り
function createDetailedTriangleMesh(params = {}) {
  const {
    p = createVector(),
    q = createVector(1, 0, 0),
    r = createVector(0, 1, 0),
    detail = 20,
  } = params
  const geom = new p5.Geometry()
  const pq = q.copy().sub(p)
  const pr = r.copy().sub(p)
  const n = pq.cross(pr).normalize()
  const indicesArray = []
  let curIndex = 0
  for (let i = 0; i <= detail; i++) {
    const indices = []
    const p1 = p5.Vector.lerp(p, q, i / detail)
    const r1 = p5.Vector.lerp(r, q, i / detail)
    for (let k = 0; k <= detail - i; k++) {
      geom.vertices.push(
        p5.Vector.lerp(p1, r1, i < detail ? k / (detail - i) : 0),
      )
      geom.vertexNormals.push(n)
      indices.push(curIndex++)
    }
    indicesArray.push(indices)
  }
  // つなげる
  for (let i = 0; i < detail; i++) {
    const lArray = indicesArray[i]
    const rArray = indicesArray[i + 1]
    for (let k = 0; k < rArray.length - 1; k++) {
      geom.faces.push(
        [lArray[k], rArray[k], lArray[k + 1]],
        [lArray[k + 1], rArray[k], rArray[k + 1]],
      )
    }
    const lastIndex = lArray.length - 1
    geom.faces.push([
      lArray[lastIndex - 1],
      rArray[lastIndex - 1],
      lArray[lastIndex],
    ])
  }
  return geom
}

// 以下、SVGをメッシュにするためのサブルーチン
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------------
// earcut.

// getIntersection.
function getDet2(a, b, c) {
  return (c.x - a.x) * (c.y - b.y) - (c.x - b.x) * (c.y - a.y)
}
/*
はじめの4つは"none"とする（交わらない）
その下のfalseについて"overlap"か"none"か調べる形
aとb,ないしはcとdは重なっていないことを想定してる
直線abに直交するaを通る線でb,c,dの位置関係を整理して判断する
abのmax<cdのmin,またはcdのmax<abのmin
この場合に"none"を返す
そうでない場合
abの中にcもしくはdを放り込む形
abのminとmaxを用意して
minより小さいかmaxより大きいなら追加せずそれ以外の場合に追加する
cdの中にaかbをぶち込む
cdのminとmaxを用意して
minより（以下略）
そういう感じですかね
それで"overlap"と称して入れる
これにより多重辺の場合は多重辺として認識されるはず

たとえばa-->bが「安全」な場合
ベクトルa->b,a->c,a->dを用意しつつ
a->bと内積取って大きさの2乗で割る
cとdがこのとき共に1より大きいか共に0より小さい場合にdisjoint判定
あとはcとdそれぞれについて0<=かつ<=1の場合に上記の値をratioとして点を取る

overlapで追加される頂点はa,b,c,dのいずれかであるゆえ、
相互の関係にはならない
たとえばa---bにcやdを追加する場合、cやdをもつpathにはすでにそれが入っている
よって一方的な関係となる
たとえばa-----bの間にcもdも挿入される場合c---dには何にも入らない
ですから...
"insert_ab"とか"insert_cd"のようなinsert用のフラグが必要になる

abもしくはcdの長さが<1e-9の場合はdisjointとしよう
別に問題ないだろう
よし
共に長さが保証されている場合に上記の処理をab及びcdについて実行して
配列の形で出力する
"insert_ab"でpでratioって感じで
なんなら全部そうするか？
"single"もその形式で書くか？って話
ratioAとかratioCとか不自然だろ
"disjoint"は[]にするとか？
*/
function getIntersection(a, b, c, d, threshold = 1e-9) {
  // a,b,c,dは2次元ベクトル
  // a-b と c-dが交わるかどうか調べる
  const abc = getDet2(a, b, c)
  const abd = getDet2(a, b, d)
  const cda = getDet2(c, d, a)
  const cdb = getDet2(c, d, b)
  if (abc < 0 && abd < 0) return { flag: 'disjoint' }
  if (abc > 0 && abd > 0) return { flag: 'disjoint' }
  if (cda < 0 && cdb < 0) return { flag: 'disjoint' }
  if (cda > 0 && cdb > 0) return { flag: 'disjoint' }

  const abr = Math.abs(abc) + Math.abs(abd)
  const cdr = Math.abs(cda) + Math.abs(cdb)

  // 4点が一直線上にあるとみなせる場合は
  // abとcdのうち距離が大きい方を取り
  // それにより4点が同一直線上にあるとみなし
  // 内積を使って大小判定を実行する

  if (abr < threshold || cdr < threshold) {
    // abかcdが0とみなせる場合は処理しない
    const distAB = a.dist(b)
    const distCD = c.dist(d)
    if (distAB < threshold || distCD < threshold) return { flag: 'disjoint' }
    const intersections = []
    const abab = distAB * distAB
    const ab_c = ((b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y)) / abab
    const ab_d = ((b.x - a.x) * (d.x - a.x) + (b.y - a.y) * (d.y - a.y)) / abab
    if (ab_c >= 0 && ab_c <= 1) {
      intersections.push({ type: 'insert_ab', p: c.copy(), ratio: ab_c })
    }
    if (ab_d >= 0 && ab_d <= 1) {
      intersections.push({ type: 'insert_ab', p: d.copy(), ratio: ab_d })
    }
    const cdcd = distCD * distCD
    const cd_a = ((d.x - c.x) * (a.x - c.x) + (d.y - c.y) * (a.y - c.y)) / cdcd
    const cd_b = ((d.x - c.x) * (b.x - c.x) + (d.y - c.y) * (b.y - c.y)) / cdcd
    if (cd_a >= 0 && cd_a <= 1) {
      intersections.push({ type: 'insert_cd', p: a.copy(), ratio: cd_a })
    }
    if (cd_b >= 0 && cd_b <= 1) {
      intersections.push({ type: 'insert_cd', p: b.copy(), ratio: cd_b })
    }
    return { flag: 'overlap', intersections }
  }

  // a---cp---bの比率
  // c---cp---dの比率
  const ratioA = Math.abs(cda) / cdr
  const ratioC = Math.abs(abc) / abr
  const intersection = p5.Vector.lerp(a, b, ratioA) // 共通にする

  // pには交差点を入れる
  return {
    flag: 'single',
    intersections: [
      { type: 'insert_ab', p: intersection, ratio: ratioA },
      { type: 'insert_cd', p: intersection, ratio: ratioC },
    ],
  }
}

// 三角形の面積がめちゃ小さい場合にfalse、そういう閾値
function insideTriangle(p0, p1, p2, p, threshold = 1e-9) {
  // pがp0,p1,p2の三角形の内部にあるかどうか調べるだけ
  // ベクトルを使った方が分かりやすいけどね。
  const a11 = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
  const a12 = (p1.x - p0.x) * (p2.x - p0.x) + (p1.y - p0.y) * (p2.y - p0.y)
  const a22 = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2)
  const qDotU = (p1.x - p0.x) * (p.x - p0.x) + (p1.y - p0.y) * (p.y - p0.y)
  const qDotV = (p2.x - p0.x) * (p.x - p0.x) + (p2.y - p0.y) * (p.y - p0.y)
  const d = a11 * a22 - a12 * a12
  if (abs(d) < threshold) return false
  const a = a22 * qDotU - a12 * qDotV
  const b = -a12 * qDotU + a11 * qDotV
  if (a > 0 && b > 0 && a + b < d) return true
  return false
}

// ---------------------------------------------------------------
// earcut
// insideTriangleは共通メソッドとして使用

// 入力はverticesとindex配列（長さ3）
// verticesから参照して点を取得
// [a,b,c]だとして
// 時計回りなら[a,b,c]を返す
// 逆なら[a,c,b]を返す。雑。
function earcutTriangle(vertices, indices, threshold = 1e-9) {
  // 3点のケース
  // 順番だけ調べる
  // 小さすぎる場合は無視
  const p = vertices[indices[0]]
  const q = vertices[indices[1]]
  const r = vertices[indices[2]]
  const cp = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
  if (abs(cp) < threshold) return []
  // cp>0の場合、p,q,rで時計回り
  // cp<0の場合、p,r,qで時計回り
  if (cp > 0) return indices.slice()
  return [indices[0], indices[2], indices[1]] // 逆！
}

// 凸ケース。いきなり終了できる。
// 0,1,2,3,4,...だとして
// orientationが1なら0,1,2,0,2,3,0,3,4,...
// -1なら0,2,1,0,3,2,0,4,3,...そんな感じ
// vertices要らんわな。indexと向き付けだけでいい。
// 0,1,2じゃないわ！！！indices[0],[1],[2]だわ！！
function earcutConvexPolygon(indices, orientation = 1) {
  const result = []
  for (let i = 1; i < indices.length - 1; i++) {
    if (orientation > 0) {
      result.push(indices[0], indices[i], indices[i + 1])
    } else {
      result.push(indices[0], indices[i + 1], indices[i])
    }
  }
  return result
}

// verticesのみでindices=[]の場合は
// verticesを順繰りに番号付けして使うが
// indicesがある場合はそれに従ってverticesから点を取得して議論する
// どのみちindexの配列は用意する
// これを空っぽにするまで処理を継続する
function executeEarcut(vertices, indices = [], threshold = 1e-9) {
  const cycle = []
  if (indices.length === 0) {
    for (let i = 0; i < vertices.length; i++) {
      cycle.push(i)
    }
  } else {
    cycle.push(...indices)
  }
  const result = [] // ここにぶちこんでく

  if (cycle.length < 3) return { vertices: vertices, faces: [] } // しっぱい！

  while (cycle.length >= 3) {
    if (cycle.length === 3) {
      // 最後の三角形をぶちこんで終了
      result.push(...earcutTriangle(vertices, cycle))
      break
    }
    // 4以上の場合は帰納法による
    // 下準備の過程で点を排除する場合には点の数を減らしてcontinue;
    // 角度の総和と角度の列を用意
    const angleArray = []
    let angleSum = 0
    let signSum = 0 // 符号の和の絶対値をpoints.lengthと比較する
    // 角度を計算する
    // 辺のなす角を記録していく。つぶれてないかどうかのチェックもここでやる。
    let crushedTriangleId = -1
    for (let i = 0; i < cycle.length; i++) {
      const p = vertices[cycle[i]]
      const q = vertices[cycle[(i + 1) % cycle.length]]
      const r = vertices[cycle[(i + 2) % cycle.length]]
      // p->qをq->rに重ねる際の角度の変化を記録していく
      const cp = (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x)
      // 三角形がつぶれてる場合は中間点を排除する
      // 直進あるいは出戻り
      if (Math.abs(cp) < threshold) {
        crushedTriangleId = (i + 1) % cycle.length
        break
      }
      const ip = (q.x - p.x) * (r.x - q.x) + (q.y - p.y) * (r.y - q.y)
      const angle = Math.atan2(cp, ip)
      angleArray.push(angle)
      angleSum += angle
      signSum += Math.sign(angle) // 1か-1を加えていく. 凸判定に使う。
    }
    // つぶれてる場合はidを排除してcontinue;
    if (crushedTriangleId >= 0) {
      cycle.splice(crushedTriangleId, 1)
      continue
    }
    // 凸の場合はそのまま答えが出る。判定は符号の和で調べられる。
    // つまりこれのためで、つぶれてるようなのがあるとこれの判定ができないんよ
    // 結果が簡単に出るのでありがたい。第二引数で符号。数字そのままでOK.
    if (Math.abs(signSum) === cycle.length) {
      result.push(...earcutConvexPolygon(cycle, signSum))
      // 処理を終了する
      break
    }
    // つぶれなく、凸でもないケース。
    // 向き付け。1か-1.
    // orientationを掛けて正なら第一の条件を満たす
    const orientation = Math.sign(angleSum)
    // 確実に存在する。信じなさい。
    let cuttingEarId = -1
    for (let i = 0; i < cycle.length; i++) {
      // 要するに外角か内角か調べてるのよ。重複を防ぐため配列を用意しておく。
      if (angleArray[i] * orientation < 0) continue
      // p,q,rの三角形にそれ以外の点が入ってないか調べる。入っていればcontinue
      // なければ排除決定
      const p = vertices[cycle[i]]
      const q = vertices[cycle[(i + 1) % cycle.length]]
      const r = vertices[cycle[(i + 2) % cycle.length]]
      let insidePointExist = false
      for (let k = 3; k < cycle.length; k++) {
        const s = vertices[cycle[(i + k) % cycle.length]]
        if (insideTriangle(p, q, r, s)) {
          insidePointExist = true
          break
        }
      }
      if (insidePointExist) continue
      // angleArray[i]の符号に応じてearArrayを構成
      if (angleArray[i] > 0) {
        result.push(
          cycle[i],
          cycle[(i + 1) % cycle.length],
          cycle[(i + 2) % cycle.length],
        )
      } else {
        result.push(
          cycle[i],
          cycle[(i + 2) % cycle.length],
          cycle[(i + 1) % cycle.length],
        )
      }
      cuttingEarId = (i + 1) % cycle.length
      // ひとつでもカット出来たら終了
      break
    }
    // もちろんあるが、万が一の場合は抜けてしまおう
    if (cuttingEarId < 0) {
      console.log('failure')
      break
    }
    cycle.splice(cuttingEarId, 1)
  }
  // おわったので出力
  return { vertices: vertices, faces: result }
}

// ----------------------------------------------------------------------------
// cycles to cycles

function cyclesToCycles(cycles) {
  // 各々のcycleはベクトル列
  // 向きはどっちでもいい
  // すべて単純閉曲線（自己交叉無し）
  // しかも互いに交わらない（相互交叉無し）とする
  // とりあえずすべて時計回りに統一しておく（面倒なので）
  const cycleObjects = []
  const allVertices = []
  let lastIndex = 0
  for (let i = 0; i < cycles.length; i++) {
    const cycle = cycles[i]
    const cycleLength = cycle.length

    const clockwise = isClockwise(cycle)
    // もう時計回りでない場合は逆にしてしまう
    // indicesだけ逆順にすることも考えたけどね
    // そのうちそうするかもだけど
    // singlePathを作るのが目的なら特に問題ないかと
    if (!clockwise) {
      cycle.reverse()
    }

    allVertices.push(...cycle)

    const indices = []
    for (let k = 0; k < cycleLength; k++) {
      indices.push(lastIndex + k)
    }
    // あとでsortに使う
    const xMax = getXMax(cycle)
    // lastIndexを足す必要ないですね...足したら参照できなくなる
    // 統合処理に支障が出る
    cycleObjects.push({
      cycleIndex: i,
      indices,
      parents: [],
      children: [],
      xMaxIndex: xMax.index,
      xMaxValue: xMax.value,
    })
    lastIndex += cycleLength // lastIndexを更新する
  }
  // 以上です
  // parentsとchild
  // cycleAとcycleBに対しAの1点とBで判定を取り
  // insideの場合にAのparentがBでBのchildがAという関係
  // なおBの1点とAに対しては何も起こらない
  // それがdisjointでも同じ判定なので、結局片側だけではダメで、
  // 両方要る

  for (let i = 0; i < cycles.length; i++) {
    const cycleA = cycles[i]
    for (let k = 0; k < cycles.length; k++) {
      if (i === k) continue
      const cycleB = cycles[k]
      if (insideCycle(cycleA[0], cycleB)) {
        cycleObjects[i].parents.push(k)
        cycleObjects[k].children.push(i)
      }
    }
  }

  // そこでparentが[]のものに着目する
  // parentが[]のもののchildたちで配列...
  // parentのlengthが大きいものを前に置く(parentが[]だと最後尾)
  // 同じ場合はxMaxValueが大きいものを後ろに置く(小さい順)
  // こうして後ろの2つからまとめていく
  const mountains = []
  for (const cycleObject of cycleObjects) {
    if (cycleObject.parents.length > 0) continue
    mountains.push([cycleObject])
  }
  // 等高線を山に見立てているのでmountainとなります
  // で。
  // sortする
  for (const mountain of mountains) {
    for (const child of mountain[0].children) {
      mountain.push(cycleObjects[child])
    }
    mountain.sort((c0, c1) => {
      if (c0.parents.length > c1.parents.length) return -1
      if (c0.parents.length < c1.parents.length) return 1
      if (c0.xMaxValue < c1.xMaxValue) return -1
      if (c0.xMaxValue > c1.xMaxValue) return 1
      return 0
    })
  }
  // 出来上がったらmountainごとにうしろから2つずつ取って...
  // もし単独ならば何にもすることが無いのです。
  // その場合はmountain[0].indices.slice()を取っておわり。

  const resultCycles = []
  const subCycleArrays = []

  for (const mountain of mountains) {
    const initialCycle = mountain.pop()
    let resultCycle = initialCycle.indices.slice()
    // subCycleの配列. clockwiseなども考慮する。側面の構成などに使う。
    const subCycleArray = [initialCycle.indices.slice()]
    if (mountain.length === 0) {
      resultCycles.push(resultCycle)
      // 一つの場合はここで入れないといけないんだ
      subCycleArrays.push(subCycleArray)
      continue
    }
    // 事前に一番最初の段階でのxMaxを取っておいてそれを使わないといけないんだ
    // それがずっと通用しつづける
    // なぜなら内部だから

    // これを先に採用しておき、右に線を伸ばす際のガイドとする
    const outerXMax = getXMax(cycles[initialCycle.cycleIndex]).value

    while (mountain.length > 0) {
      const target = mountain.pop()
      const L0 = target.indices.length
      const L1 = resultCycle.length
      // targetとresultCycleをつなげる
      // まずtargetのxMaxIndexからx最大点を取得してその点から
      // resultCycleのxMaxを半分とする対蹠点への線分を作り
      // 線分交叉で得られるresultCycleの方の線分との交点を取る
      // single/overlapで得られる交点をかき集める
      // 一番近いものを取りそれに対応する辺を用意する
      // 辺の両端との距離が1e-10未満であればそのまま採用する
      // そうでない場合は時計回りですから
      // 大きい方を取る
      // 交点、大きい方、targetの最大点で三角形を作る
      // 三角形の内部にresultCycleの点がなければ大きい方を採用する
      // あればそのうちでatan2の絶対値が最小のものを採用する
      // atan2は最大点から交点に向かうやつとその点に向かうやつで取る
      // 採用した点がresultCycleの何番目か記録しておく
      // targetのindicesを用意する
      // resultCyclesを、採用点から採用点まで時計回りに進み、
      // そこで最大点に行き、反時計回りにtargetのindicesを進み、最大点に戻る。
      // そういうサイクルとしてnewCycleを作ってそれで置き換える
      // 次のループに進む。
      const { xMaxIndex, xMaxValue } = target

      const xMaxPoint = allVertices[target.indices[xMaxIndex]]

      const horizon = xMaxPoint.y
      // outerXMaxは先に計算しておく
      const outerPoint = createVector(outerXMax + 100, horizon)
      // (xMaxPoint, outerPoint)で線分
      // これとresultCycleで線分交叉やって交わる辺を探す
      let crossPoints = []
      for (let i = 0; i < L1; i++) {
        const p = allVertices[resultCycle[i]]
        const q = allVertices[resultCycle[(i + 1) % L1]]
        const ic = getIntersection(xMaxPoint, outerPoint, p, q)
        if (ic.flag === 'disjoint') continue
        for (let eachIC of ic.intersections) {
          if (eachIC.type === 'insert_ab') {
            crossPoints.push({ p: eachIC.p, ratio: eachIC.ratio, index: i })
          }
        }
      }
      crossPoints.sort((cp0, cp1) => {
        if (cp0.ratio < cp1.ratio) return -1
        if (cp0.ratio > cp1.ratio) return 1
        return 0
      })
      const cp = crossPoints[0] // ratio最小
      const left = allVertices[resultCycle[cp.index]]
      const right = allVertices[resultCycle[(cp.index + 1) % L1]]
      let cutIndex
      // leftに近ければleft,rightに近ければright.
      // どっちも違うならxMaxPoint, cp.p, rightで三角形を作り
      // 若干面倒な処理をする
      // rightか、または内部の点のうちxMaxPoint --> cp.pとの成す角が
      // 最小の点を取る
      if (cp.p.dist(left) < 1e-10) {
        cutIndex = cp.index
      } else if (cp.p.dist(right) < 1e-10) {
        cutIndex = (cp.index + 1) % resultCycle.length
      } else {
        const candidate = []
        for (let k = 0; k < L1; k++) {
          const candidatePoint = allVertices[resultCycle[k]]
          if (insideTriangle(xMaxPoint, cp.p, right, candidatePoint)) {
            const angle = getAngleBetween2D(xMaxPoint, cp.p, candidatePoint)
            candidate.push({ angle: Math.abs(angle), index: k })
          }
        }
        if (candidate.length === 0) {
          // rightを採用
          cutIndex = (cp.index + 1) % L1
        } else {
          //angleでsortする
          candidate.sort((cd0, cd1) => {
            if (cd0.angle < cd1.angle) return -1
            if (cd0.angle > cd1.angle) return 1
            return 0
          })
          // 0番を取る
          cutIndex = candidate[0].index
        }
      }
      // cutIndexが決まったので統合に入る
      const newCycle = [resultCycle[cutIndex]]
      for (let k = 1; k <= L1; k++) {
        newCycle.push(resultCycle[(cutIndex + k) % L1])
      }

      const subCycle = []
      //newCycle.push(target.indices[xMaxIndex]);
      subCycle.push(target.indices[xMaxIndex])
      // parentsの数が深さで、これが奇数の場合逆にし、偶数の場合順方向。
      const clockwiseAdding = target.parents.length % 2 === 1 ? false : true
      // 残りの点を追加
      for (let k = 1; k <= L0; k++) {
        if (clockwiseAdding) {
          //newCycle.push(target.indices[(xMaxIndex+k) % L0]);
          subCycle.push(target.indices[(xMaxIndex + k) % L0])
        } else {
          //newCycle.push(target.indices[(xMaxIndex-k+L0) % L0]);
          subCycle.push(target.indices[(xMaxIndex - k + L0) % L0])
        }
      }
      newCycle.push(...subCycle)
      resultCycle = newCycle
      subCycle.pop() // 重複排除
      subCycleArray.push(subCycle)
    }
    // resultCyclesにresultCycleを放り込む
    resultCycles.push(resultCycle)
    subCycleArrays.push(subCycleArray)
    // 次のmountainへ進む...
  }
  // allVerticesとresultCyclesを
  // {vertices:allVertices, cycles:resultCycles}
  // として出力する
  return {
    vertices: allVertices,
    cycles: resultCycles,
    subCycleArrays: subCycleArrays,
  }
  // この形式のcycleであればearcutが適用でき、テッセレーションが可能。
}

function getXMax(contour) {
  // x座標が最大となるindexを返すだけ。入力は閉路。何でもOK.
  let xMax = -Infinity
  let xMaxIndex = -1
  for (let i = 0; i < contour.length; i++) {
    if (xMax < contour[i].x) {
      xMax = contour[i].x
      xMaxIndex = i
    }
  }
  return { value: xMax, index: xMaxIndex }
}

function getAngleBetween2D(a, b, c) {
  // a-->bとa-->cのなす角。2次元専用。
  // a-->bをa-->cにする向きが正の時、正の値。
  // 3次元には使えないのであしからず。
  const cv = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
  const dv = (b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y)
  return Math.atan2(cv, dv)
}

function isClockwise(cycle) {
  // 時計回りの時trueを返す
  // ベクトルの角度の変化を全部足すだけ
  // 前提として3点以上...だがまあ問題ないだろ
  let angleSum = 0
  if (cycle.length < 3) return true
  for (let i = 0; i < cycle.length; i++) {
    const p = cycle[i]
    const q = cycle[(i + 1) % cycle.length]
    const r = cycle[(i + 2) % cycle.length]
    const crossValue = (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x)
    const dotValue = (q.x - p.x) * (r.x - q.x) + (q.y - p.y) * (r.y - q.y)
    angleSum += Math.atan2(crossValue, dotValue)
  }
  if (angleSum > 0) return true
  return false
}

function insideCycle(p, cycle) {
  // pがcycleの内部に含まれているときtrueを返す
  // cycleはベクトル列を想定
  // cycleは単純閉曲線。向きはどっちでもOK
  // 角度を全部足してPI/2より大きければOK
  let angleSum = 0
  for (let i = 0; i < cycle.length; i++) {
    const q = cycle[i]
    const r = cycle[(i + 1) % cycle.length]
    const crossValue = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
    const dotValue = (q.x - p.x) * (r.x - p.x) + (q.y - p.y) * (r.y - p.y)
    angleSum += Math.atan2(crossValue, dotValue)
  }
  if (Math.abs(angleSum) > 6) return true
  return false
}

// ----------------------------------------------------------------------------
// svg -> cycles

// ここが洗練されてきたのは良い収穫
// まだまだ汚いけど...
// data: svgのテキストデータ
// bezierDetail2,3: QやCのベジエの補間数
// parseScale: パースする際のスケール. 単純に全体を何倍するか
// lineSegmentLength: 直線(L)を分割する際の最小単位をどうするか
// ここが洗練されてきたのは良い収穫
// まだまだ汚いけど...
// data: svgのテキストデータ
// bezierDetail2,3: QやCのベジエの補間数
// parseScale: パースする際のスケール. 単純に全体を何倍するか
// lineSegmentLength: 直線(L)を分割する際の最小単位をどうするか
function parseData(options = {}) {
  const {
    data = 'M 0 0',
    bezierDetail2 = 8,
    bezierDetail3 = 5,
    parseScale = 1,
    lineSegmentLength = 1,
  } = options
  const cmdData = data.split(' ')
  const result = []
  let subData = []
  for (let i = 0; i < cmdData.length; i++) {
    switch (cmdData[i]) {
      case 'M':
        if (subData.length > 0) result.push(subData.slice())
        subData.length = 0
        subData.push(
          createVector(Number(cmdData[i + 1]), Number(cmdData[i + 2])).mult(
            parseScale,
          ),
        )
        i += 2
        break
      case 'L':
        const p = subData[subData.length - 1]
        const q = createVector(
          Number(cmdData[i + 1]),
          Number(cmdData[i + 2]),
        ).mult(parseScale)
        const lineLength = q.dist(p)
        for (
          let lengthSum = 0;
          lengthSum < lineLength;
          lengthSum += lineSegmentLength
        ) {
          subData.push(p5.Vector.lerp(p, q, lengthSum / lineLength))
        }
        subData.push(q)
        i += 2
        break
      case 'Q':
        const p0 = subData[subData.length - 1]
        const a0 = Number(cmdData[i + 1]) * parseScale
        const b0 = Number(cmdData[i + 2]) * parseScale
        const c0 = Number(cmdData[i + 3]) * parseScale
        const d0 = Number(cmdData[i + 4]) * parseScale
        for (let k = 1; k <= bezierDetail2; k++) {
          const t = k / bezierDetail2
          subData.push(
            createVector(
              (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * a0 + t * t * c0,
              (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * b0 + t * t * d0,
            ),
          )
        }
        i += 4
        break
      case 'C':
        const p1 = subData[subData.length - 1]
        const a1 = Number(cmdData[i + 1]) * parseScale
        const b1 = Number(cmdData[i + 2]) * parseScale
        const c1 = Number(cmdData[i + 3]) * parseScale
        const d1 = Number(cmdData[i + 4]) * parseScale
        const e1 = Number(cmdData[i + 5]) * parseScale
        const f1 = Number(cmdData[i + 6]) * parseScale
        for (let k = 1; k <= bezierDetail3; k++) {
          const t = k / bezierDetail3
          subData.push(
            createVector(
              (1 - t) * (1 - t) * (1 - t) * p1.x +
                3 * t * (1 - t) * (1 - t) * a1 +
                3 * t * t * (1 - t) * c1 +
                t * t * t * e1,
              (1 - t) * (1 - t) * (1 - t) * p1.y +
                3 * t * (1 - t) * (1 - t) * b1 +
                3 * t * t * (1 - t) * d1 +
                t * t * t * f1,
            ),
          )
        }
        i += 6
        break
      case 'Z':
        // 最初の点を追加するんだけど、subData[0]を直接ぶち込むと
        // 頭とおしりが同じベクトルになってしまうので、
        // copy()を取らないといけないんですね
        // Lでつなぎます。
        const p2 = subData[subData.length - 1]
        const q2 = subData[0].copy()
        const lineLength2 = q2.dist(p2)
        for (
          let lengthSum = 0;
          lengthSum < lineLength2;
          lengthSum += lineSegmentLength
        ) {
          subData.push(p5.Vector.lerp(p2, q2, lengthSum / lineLength2))
        }
        subData.push(q2)
        //result.push(subData.slice());
        break
    }
  }
  // Mが出てこない場合はパス終了
  result.push(subData.slice())
  return result
}

// merging
// threshold: 非常に近い（というか同じ）点が連続していたら排除する
function mergePoints(points, options = {}) {
  const { threshold = 0.000001, closed = false } = options

  for (let i = points.length - 1; i >= 1; i--) {
    const p = points[i]
    const q = points[i - 1]
    if (p.dist(q) < threshold) {
      //console.log("merge");
      points.splice(i, 1)
    }
  }
  if (closed) {
    // 頭に戻る場合はそれも排除する
    if (points[0].dist(points[points.length - 1]) < threshold) {
      points.pop()
    }
  }
}

// closedはすべてに適用される
function mergePointsAll(contours, options = {}) {
  for (let contour of contours) {
    mergePoints(contour, options)
  }
}

// 等間隔化にもclosed optionを導入したいな
function evenlySpacing(points, options = {}) {
  const { minLength = 1, closed = false } = options
  // minLengthより長い長さがある場合に、点を挿入する
  let newPoints = []
  newPoints.push(points[0])

  for (let i = 1; i < points.length; i++) {
    // iとi-1の距離を調べてminより小さければそのままiを入れて終了
    // 大きければ間も含めていくつか点を入れる
    // ここも後ろから入れないとおかしなことになるので注意！！って思ったけど
    // ああそうか、バグの原因それか...このやり方なら問題ないです。
    const d = points[i].dist(points[i - 1])
    if (d < minLength) {
      newPoints.push(points[i])
    } else {
      const m = Math.floor(d / minLength) + 1
      for (let k = 1; k <= m; k++) {
        newPoints.push(p5.Vector.lerp(points[i - 1], points[i], k / m))
      }
    }
  }

  // 線の長さの総和を求めると同時に長さの列を取得
  let lengthArray = []
  for (let i = 0; i < newPoints.length - 1; i++) {
    const d = newPoints[i].dist(newPoints[i + 1])
    lengthArray.push(d)
  }

  // minLengthを超えるたびにそれを引く、を繰り返す
  // もしくは？
  // lastPointという概念を用意。最初はnewPoints[0]から始める。
  // localSumが閾値未満であれば新しい点でlastPointをおきかえる
  // 超えた場合はlastPointと新しい点を(localSum-minLength)/distanceでlerpして
  // ??違う、(minLength-(localSum-distance))/distanceか。
  // あるいはlocalSum + distance > minLengthかどうか見るとか。<とか。
  let localSum = 0
  const result = [newPoints[0]]
  const lastPoint = createVector()
  lastPoint.set(result[0])
  for (let i = 1; i < newPoints.length; i++) {
    const distance = newPoints[i].dist(lastPoint)
    if (localSum + distance < minLength) {
      lastPoint.set(newPoints[i])
      localSum += distance
    } else {
      // オーバーした場合はlerpで該当する点を求める
      const ratio = (minLength - localSum) / distance
      const middlePoint = p5.Vector.lerp(lastPoint, newPoints[i], ratio)
      result.push(middlePoint)
      lastPoint.set(middlePoint)
      // localSumを初期化
      localSum = 0
    }
  }

  // closed caseでOKでした。オプション用意するの忘れてた。バカ。

  // pointsをresultで書き換える
  points.length = 0
  for (let i = 0; i < result.length; i++) {
    points.push(result[i])
  }

  // closedの場合はおしりもチェック...？？
  if (closed) {
    const endPoint = points[points.length - 1]
    const beginPoint = points[0]
    const distance = endPoint.dist(beginPoint)
    if (distance > minLength) {
      // たとえば2.1と1の場合は3分割するが1.9と1の場合は2分割する
      const m = floor(distance / minLength) + 1
      for (let k = 1; k < m; k++) {
        points.push(p5.Vector.lerp(endPoint, beginPoint, k / m))
      }
    }
  }
}

function evenlySpacingAll(contours, minLength) {
  for (let contour of contours) {
    evenlySpacing(contour, minLength)
  }
}

// -------------------------------------------------------------------

// 閉曲線(closed)前提
function getContoursFromSVG(params = {}) {
  const {
    svgData = 'M 0 0 L 1 0 L 1 1 L 0 1 Z',
    scaleFactor = 200,
    bezierDetail2 = 8,
    lineSegmentLengthRatio = 1 / 64,
    spacingMinLengthRatio = 1 / 40,
    mergeThresholdRatio = 1 / 100,
  } = params
  const resultContours = parseData({
    data: svgData,
    parseScale: scaleFactor,
    bezierDetail2: bezierDetail2,
    lineSegmentLength: lineSegmentLengthRatio * scaleFactor,
  })

  mergePointsAll(resultContours, { closed: true })
  evenlySpacingAll(resultContours, {
    minLength: spacingMinLengthRatio * scaleFactor,
    closed: true,
  })
  mergePointsAll(resultContours, {
    threshold: mergeThresholdRatio * scaleFactor,
    closed: true,
  })

  return resultContours
}

// --------------------------------------------------------------------
// mesh

// 面だけ
function createPlaneMeshFromCycles(options = {}) {
  const { result, planeHeight = 0 } = options
  const { vertices, cycles, subCycleArrays } = result
  const geom = new p5.Geometry()

  // 面だけ。シンプル。

  const vn = vertices.length

  for (let i = 0; i < vn; i++) {
    const v = vertices[i]
    geom.vertices.push(createVector(v.x, v.y, planeHeight))
    geom.vertexNormals.push(createVector(0, 0, 1))
  }
  for (const cycle of cycles) {
    const faces = executeEarcut(vertices, cycle).faces
    for (let i = 0; i < faces.length; i += 3) {
      geom.faces.push([faces[i], faces[i + 1], faces[i + 2]])
    }
  }

  return geom
}

// BoardMeshの方がいいんじゃないかと...思うけども。
// というわけでBoardMeshに改名しました
function createBoardMeshFromCycles(options) {
  const { result, thick = 20 } = options
  const { vertices, cycles, subCycleArrays } = result
  const geom = new p5.Geometry()

  // まず、verticesはすべて入れる。具体的にはthickだけ上にずらして全部入れ、
  // 下にずらして全部入れる
  // そのうえで...
  // cycleごとにearcutを実行し、結果のfacesについて、facesを構成する。
  // その際、上面として普通に用いる（まんま！）
  // 下面はvertices.lengthを加えたうえで1番と2番をswapしてそのまま用いる（まんま）

  // facesって3つずつ配列で放り込むんですね。.....

  const vn = vertices.length

  for (let i = 0; i < vn; i++) {
    const v = vertices[i]
    geom.vertices.push(createVector(v.x, v.y, thick))
  }
  for (let i = 0; i < vn; i++) {
    const v = vertices[i]
    geom.vertices.push(createVector(v.x, v.y, -thick))
  }
  for (const cycle of cycles) {
    const faces = executeEarcut(vertices, cycle).faces
    for (let i = 0; i < faces.length; i += 3) {
      geom.faces.push([faces[i], faces[i + 1], faces[i + 2]])
      geom.faces.push([vn + faces[i], vn + faces[i + 2], vn + faces[i + 1]])
    }
  }

  // 終わったら、subCycleをひとつずつあたっていく
  // それぞれverticesに従って上と下の頂点を放り込みつつ...
  // 上下1つずつ放り込むと分かりやすい
  // 側面のfacesを作っていく
  // この際lastIndexを2*vertices.lengthから始めて、
  // 2*subCycle.lengthを毎回加えていく。以上。

  let lastIndex = vn * 2
  for (const subCycleArray of subCycleArrays) {
    for (const subCycle of subCycleArray) {
      const cn = subCycle.length
      for (let i = 0; i < cn; i++) {
        const v = vertices[subCycle[i]]
        geom.vertices.push(createVector(v.x, v.y, thick))
        geom.vertices.push(createVector(v.x, v.y, -thick))
      }
      for (let i = 0; i < cn; i++) {
        const ru = lastIndex + 2 * i
        const rd = lastIndex + 2 * i + 1
        const lu = lastIndex + 2 * ((i + 1) % cn)
        const ld = lastIndex + 2 * ((i + 1) % cn) + 1
        geom.faces.push([lu, ru, rd], [lu, rd, ld])
      }
      lastIndex += cn * 2
    }
  }

  geom.computeNormals()
  return geom
}
