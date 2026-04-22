// classic_saucer.frag
// 1950s chrome flying saucer — SDF-based
// Rotating rim lights, chrome hull, optional beam below
// Uniforms: iTime, iResolution

precision mediump float;
uniform float iTime;
uniform vec2 iResolution;

#define CHROME vec3(0.784, 0.8, 0.816)
#define RIM_GLOW vec3(0.965, 0.886, 0.478)
#define SKY vec3(0.122, 0.227, 0.42)
#define BLACK vec3(0.0)

vec2 rot2(vec2 p, float a) {
  return vec2(p.x*cos(a)-p.y*sin(a), p.x*sin(a)+p.y*cos(a));
}

// SDF: oblate ellipsoid (saucer body)
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p/r);
  float k1 = length(p/(r*r));
  return k0*(k0-1.0)/k1;
}

// SDF 2D capsule dome
float sdDome(vec2 p) {
  p.y -= 0.08;
  return sdEllipsoid(vec3(p.x, p.y, 0.0), vec3(0.14, 0.10, 0.14));
}

// Saucer body SDF (2D cross-section)
float sdSaucer(vec2 p) {
  return sdEllipsoid(vec3(p.x, p.y * 1.8, 0.0), vec3(0.38, 0.22, 0.38));
}

// Rim light position at angle theta
vec2 rimLight(float theta) {
  return vec2(cos(theta) * 0.36, -0.01);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  // Slight hover bob
  uv.y -= sin(t * 0.8) * 0.02;

  // Background: night sky gradient
  vec3 col = mix(SKY * 0.3, SKY * 0.1, uv.y + 0.5);

  // Stars
  vec2 starUV = uv * 8.0;
  float star = step(0.98, fract(sin(dot(floor(starUV), vec2(127.1, 311.7))) * 43758.5));
  col += star * 0.6;

  // Saucer outline (black backing)
  float saucerOut = sdSaucer(uv);
  col = mix(col, BLACK, smoothstep(0.01, -0.01, saucerOut + 0.015));

  // Saucer chrome fill
  float saucer = sdSaucer(uv);
  vec3 chromeColor = CHROME;
  // Fresnel-style shading: darker on underside
  chromeColor *= mix(0.3, 1.2, smoothstep(-0.15, 0.15, uv.y));
  col = mix(col, chromeColor, smoothstep(0.008, -0.008, saucer));

  // Specular highlight on top curve
  float spec = exp(-pow(length(uv - vec2(-0.08, 0.12)) * 6.0, 2.0));
  col += vec3(1.0) * spec * smoothstep(0.008, -0.008, saucer) * 0.4;

  // Dome
  float dome = sdDome(uv);
  col = mix(col, BLACK, smoothstep(0.01, -0.01, dome + 0.012));
  col = mix(col, CHROME * 1.1, smoothstep(0.008, -0.008, dome));

  // Rotating rim lights (24 of them)
  float rimGlow = 0.0;
  for (int i = 0; i < 24; i++) {
    float angle = float(i) / 24.0 * 6.28318 + t * 1.2;
    vec2 lp = rimLight(angle);
    float d = length(uv - lp);
    // Only show front-facing lights (simple z-cull approximation)
    float vis = step(0.0, sin(angle - t * 1.2));
    rimGlow += exp(-d * 80.0) * 0.5 * vis;
    // Strobe: every 3rd light pulses
    if (mod(float(i), 3.0) < 1.0) {
      float pulse = step(0.5, sin(t * 4.0 + float(i) * 0.8));
      rimGlow += exp(-d * 60.0) * 0.4 * pulse * vis;
    }
  }
  col += RIM_GLOW * rimGlow;
  col += RIM_GLOW * exp(-abs(sdSaucer(uv)) * 15.0) * 0.15;

  // Abduction beam below
  float beamActive = step(0.5, sin(t * 0.3));
  if (beamActive > 0.5) {
    float beamX = abs(uv.x);
    float beamY = uv.y + 0.25;
    float beam = smoothstep(0.15, 0.0, beamX - (-beamY * 0.15));
    beam *= smoothstep(-0.25, -0.6, uv.y);
    beam *= smoothstep(-0.6, -0.25, uv.y);
    col += vec3(0.7, 0.9, 0.6) * beam * 0.3;
  }

  // Glow around whole craft
  float craftGlow = exp(-max(0.0, sdSaucer(uv)) * 8.0);
  col += RIM_GLOW * craftGlow * 0.1;

  // Vignette
  col *= 1.0 - length(uv) * 0.6;

  gl_FragColor = vec4(col, 1.0);
}
