#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;

void main() {

  // float r = gl_FragCoord.x / u_resolution.x;
  // float g = 0.0;
  // float b = gl_FragCoord.y / u_resolution.y;

  // gl_FragColor = vec4(r, g, b, 1.0);

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec3 color = vec3(uv, 1.0);

  gl_FragColor = vec4(color, 1.0);
}