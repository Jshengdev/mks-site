// Water surface vertex shader — the "sky" of the Tide Pool
// A plane at the top of the pool with animated ripple displacement.
// Viewed from BELOW — this is what creates the caustic light patterns
// and the distorted view of the world above.
//
// Stolen from: thaslle/stylized-water (Ashima simplex noise for surface deformation)

uniform float uTime;
uniform float uRippleFrequency;   // 3.5
uniform float uRippleSpeed;       // 0.4
uniform float uRippleAmplitude;   // 0.15

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;

// Ashima simplex noise (same as caustic shader)
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= taylorInvSqrt(a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vUv = uv;

  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  // Ripple displacement — two layers of simplex noise at different scales
  float t = uTime * uRippleSpeed;
  float ripple1 = snoise(worldPos.xz * uRippleFrequency * 0.01 + vec2(t * 0.7, t * -0.3));
  float ripple2 = snoise(worldPos.xz * uRippleFrequency * 0.017 + vec2(t * -0.4, t * 0.5));

  // Combine ripples — layer 1 is primary, layer 2 adds detail
  float ripple = ripple1 * 0.7 + ripple2 * 0.3;
  worldPos.y += ripple * uRippleAmplitude;

  vWorldPos = worldPos.xyz;

  // Compute deformed normal from ripple gradient (central difference)
  float eps = 0.1;
  float rx = snoise((worldPos.xz + vec2(eps, 0.0)) * uRippleFrequency * 0.01 + vec2(t * 0.7, t * -0.3));
  float rz = snoise((worldPos.xz + vec2(0.0, eps)) * uRippleFrequency * 0.01 + vec2(t * 0.7, t * -0.3));
  vec3 tangentX = vec3(eps, (rx - ripple1) * uRippleAmplitude, 0.0);
  vec3 tangentZ = vec3(0.0, (rz - ripple1) * uRippleAmplitude, eps);
  vNormal = normalize(cross(tangentZ, tangentX));

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
