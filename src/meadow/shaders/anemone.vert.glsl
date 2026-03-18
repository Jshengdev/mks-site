// Anemone tentacle vertex shader
// The "trees" of the tide pool — instanced tubes swaying in underwater current
//
// Technique stolen from:
//   Nitash-Biswas/grass-shader-glsl — multi-layer sine deformation along height
//   mattatz/unity-verlet-simulator — tentacle sway concept (adapted to vertex shader)
//   al-ro/grass — quaternion bend concept (simplified to sine chain)
//
// Key insight: tentacles are like grass blades but 100x larger and underwater.
// Instead of wind, the current drives them. Instead of 4 wind layers,
// we use 3 sine layers with different frequencies for organic undulation.
// The base is fixed (attached to rock), tips sway most.

uniform float uTime;
uniform float uSwaySpeed;       // 0.4 — slow underwater current
uniform float uSwayAmplitude;   // 0.3 — moderate tip displacement
uniform vec3 uCurrentDir;       // prevailing current direction (normalized)
uniform float uBrightness;      // atmosphere-driven brightness

// Per-instance attributes
attribute float aPhase;        // random phase offset per tentacle (0-2PI)
attribute float aHeight;       // tentacle height (world units)
attribute vec3 aBaseColor;     // color from palette

varying float vElevation;      // 0=base, 1=tip (for lighting)
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vWorldPos;
varying float vBrightness;

// Perlin noise for organic variation (from Nitash-Biswas)
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0);
  vec4 ix = Pi.xzxz; vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz; vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x); vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z); vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

void main() {
  // Instance transform
  vec4 worldPos4 = instanceMatrix * vec4(position, 1.0);

  // Height along tentacle: Y position relative to base (0=base, 1=tip)
  // Geometry is a unit tube (0→1 in Y), instanceMatrix Y-scales to actual height.
  // position.y is always 0→1 in local space regardless of instance scale.
  float heightRatio = clamp(position.y, 0.0, 1.0);
  vElevation = heightRatio;

  // --- 3-layer sine deformation (underwater current sway) ---
  // Layer 1: Primary current sway (large, slow)
  // aHeight modulates spatial frequency — taller tentacles wave at longer periods
  float t = uTime * uSwaySpeed;
  float sway1 = sin(t * 0.7 + aPhase + heightRatio * aHeight * 0.5) * 0.6;
  // Layer 2: Secondary oscillation (medium, faster, perpendicular)
  float sway2 = sin(t * 1.3 + aPhase * 2.0 + heightRatio * aHeight * 1.0 + 1.57) * 0.25;
  // Layer 3: Fine tremor (small, fast — organic jitter from turbulence)
  float sway3 = cnoise(vec2(t * 0.5 + heightRatio * aHeight, aPhase * 3.0)) * 0.15;

  float totalSway = (sway1 + sway2 + sway3) * uSwayAmplitude;

  // Apply sway — increases with height (base fixed, tips sway most)
  // Quadratic falloff: tips move 4x more than midpoint (t^2 curve)
  float swayWeight = heightRatio * heightRatio;

  // Sway in current direction + slight perpendicular wobble
  vec3 swayOffset = uCurrentDir * totalSway * swayWeight;
  // Perpendicular secondary sway (cross product with up)
  vec3 perpDir = normalize(cross(uCurrentDir, vec3(0.0, 1.0, 0.0)));
  swayOffset += perpDir * sway2 * swayWeight * 0.4;

  worldPos4.xyz += swayOffset;

  // Compute normal from instance matrix (for lighting)
  mat3 normalMat = mat3(instanceMatrix);
  vNormal = normalize(normalMat * normal);
  vColor = aBaseColor;
  vWorldPos = worldPos4.xyz;
  vBrightness = uBrightness;

  gl_Position = projectionMatrix * viewMatrix * worldPos4;
}
