const colorScheme = [
  {
    name: "Benedictus",
    colors: ["#F27EA9", "#366CD9", "#5EADF2", "#636E73", "#F2E6D8"],
  },
  {
    name: "Cross",
    colors: ["#D962AF", "#58A6A6", "#8AA66F", "#F29F05", "#F26D6D"],
  },
  {
    name: "Demuth",
    colors: ["#222940", "#D98E04", "#F2A950", "#BF3E21", "#F2F2F2"],
  },
  {
    name: "Hiroshige",
    colors: ["#1B618C", "#55CCD9", "#F2BC57", "#F2DAAC", "#F24949"],
  },
  {
    name: "Hokusai",
    colors: ["#074A59", "#F2C166", "#F28241", "#F26B5E", "#F2F2F2"],
  },
  {
    name: "Hokusai Blue",
    colors: ["#023059", "#459DBF", "#87BF60", "#D9D16A", "#F2F2F2"],
  },
  {
    name: "Java",
    colors: ["#632973", "#02734A", "#F25C05", "#F29188", "#F2E0DF"],
  },
  {
    name: "Kandinsky",
    colors: ["#8D95A6", "#0A7360", "#F28705", "#D98825", "#F2F2F2"],
  },
  {
    name: "Monet",
    colors: ["#4146A6", "#063573", "#5EC8F2", "#8C4E03", "#D98A29"],
  },
  {
    name: "Nizami",
    colors: ["#034AA6", "#72B6F2", "#73BFB1", "#F2A30F", "#F26F63"],
  },
  {
    name: "Renoir",
    colors: ["#303E8C", "#F2AE2E", "#F28705", "#D91414", "#F2F2F2"],
  },
  {
    name: "VanGogh",
    colors: ["#424D8C", "#84A9BF", "#C1D9CE", "#F2B705", "#F25C05"],
  },
  {
    name: "Mono",
    colors: ["#D9D7D8", "#3B5159", "#5D848C", "#7CA2A6", "#262321"],
  },
  {
    name: "RiverSide",
    colors: ["#906FA6", "#025951", "#252625", "#D99191", "#F2F2F2"],
  },
];

function setup() {
  createCanvas((W = windowHeight - 50), W);
  background(200);
  strokeWeight(5);
  noFill();
  const cp = random(colorScheme).colors;
  const span = W / 8;

  for (let x = 0; x < W; x += span) {
    for (let y = 0; y < W; y += span) {
      // push();
      // stroke(255);
      // strokeWeight(1);
      // line(0, y, width, y);
      // line(x, 0, x, height);
      // pop();

      stroke(random(cp));
      let tmp = random();
      switch (~~random(6)) {
        // left-top to right-bottom line
        case 0:
          line(x, y, x + span, y + span);
          break;
        // right-bottom to right-top line
        case 1:
          line(x, y + span, x + span, y);
          break;
        // left open half circle
        case 2:
          arc(x + span / 2, y + span / 2, span, span, -HALF_PI, HALF_PI);
          if (tmp < 0.3) {
            line(x, y, x + span / 2, y);
          } else if (tmp < 0.5) {
            line(x, y + span, x + span / 2, y + span);
          }
          break;
        // right open half circle
        case 3:
          arc(x + span / 2, y + span / 2, span, span, HALF_PI, HALF_PI * 3);
          if (tmp < 0.3) {
            line(x + span / 2, y, x + span, y);
          } else if (tmp < 0.5) {
            line(x + span / 2, y + span, x + span, y + span);
          }
          break;
        // top open half circle
        case 4:
          arc(x + span / 2, y + span / 2, span, span, 0, PI);
          if (tmp < 0.3) {
            line(x, y, x, y + span / 2);
          } else if (tmp < 0.5) {
            line(x + span, y, x + span, y + span / 2);
          }
          break;
        // bottom open half circle
        case 5:
          arc(x + span / 2, y + span / 2, span, span, PI, TAU);
          if (tmp < 0.3) {
            line(x, y + span / 2, x, y + span);
          } else if (tmp < 0.5) {
            line(x + span, y + span / 2, x + span, y + span);
          }
          break;
      }
    }
  }
}

function keyPressed() {
  if (key === "s") {
    saveCanvas("mySketch", "png");
  }
}
