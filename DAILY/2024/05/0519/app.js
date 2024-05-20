let items = []
const NUM = 120
const radiusScale = 0.55

let xoff = 0

function setup() {
  createCanvas((W = windowHeight - 100), W)
  noStroke()
  seed = random(1000)
}

function draw() {
  randomSeed(seed)
  background(255)
  translate(W / 2, W / 2)

  const c = random(colorPalette).colors

  for (let i = 0; i < NUM; i++) {
    m = map(i, 0, NUM, 0, TAU) + xoff
    n = map(i, 0, NUM, -1.0, 1.2) + 0.2
    u = map(i, 0, NUM, 0, 1.2)
    rotate(PI / 4)

    fill(c[0])
    circle(i * n * sin(m), i * 1.5, i * u * radiusScale * 0.4)
    fill(c[1])
    circle(i * n * cos(m), i * 2.0, i * u * radiusScale * 0.2)
    fill(c[2])
    circle(i * n * sin(m), i * 2.5, i * u * radiusScale * 0.2)
    fill(c[3])
    circle(i * n * cos(m), i * 3.0, i * u * radiusScale * 0.3)
    fill(c[4])
    circle(i * n * sin(m), i * 3.5, i * u * radiusScale * 0.4)
  }

  xoff += 0.05
}

function keyPressed() {
  if (key === 's') {
    saveGif(`mySketch-${round(new Date().getTime() / 100000)}`, 5)
  }

  if (key === 'c') {
    saveCanvas(`mySketch-${round(new Date().getTime() / 100000)}`, 'jpeg')
  }
}

const colorPalette = [
  {
    name: 'Benedictus',
    colors: ['#F27EA9', '#366CD9', '#5EADF2', '#636E73', '#F2E6D8'],
  },
  {
    name: 'Cross',
    colors: ['#D962AF', '#58A6A6', '#8AA66F', '#F29F05', '#F26D6D'],
  },
  {
    name: 'Demuth',
    colors: ['#222940', '#D98E04', '#F2A950', '#BF3E21', '#F2F2F2'],
  },
  {
    name: 'Hiroshige',
    colors: ['#1B618C', '#55CCD9', '#F2BC57', '#F2DAAC', '#F24949'],
  },
  {
    name: 'Hokusai',
    colors: ['#074A59', '#F2C166', '#F28241', '#F26B5E', '#F2F2F2'],
  },
  {
    name: 'Hokusai Blue',
    colors: ['#023059', '#459DBF', '#87BF60', '#D9D16A', '#F2F2F2'],
  },
  {
    name: 'Java',
    colors: ['#632973', '#02734A', '#F25C05', '#F29188', '#F2E0DF'],
  },
  {
    name: 'Kandinsky',
    colors: ['#8D95A6', '#0A7360', '#F28705', '#D98825', '#F2F2F2'],
  },
  {
    name: 'Monet',
    colors: ['#4146A6', '#063573', '#5EC8F2', '#8C4E03', '#D98A29'],
  },
  {
    name: 'Nizami',
    colors: ['#034AA6', '#72B6F2', '#73BFB1', '#F2A30F', '#F26F63'],
  },
  {
    name: 'Renoir',
    colors: ['#303E8C', '#F2AE2E', '#F28705', '#D91414', '#F2F2F2'],
  },
  {
    name: 'VanGogh',
    colors: ['#424D8C', '#84A9BF', '#C1D9CE', '#F2B705', '#F25C05'],
  },
  {
    name: 'Mono',
    colors: ['#D9D7D8', '#3B5159', '#5D848C', '#7CA2A6', '#262321'],
  },
  {
    name: 'RiverSide',
    colors: ['#906FA6', '#025951', '#252625', '#D99191', '#F2F2F2'],
  },
]
