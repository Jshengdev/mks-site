// Stylized ocean fragment shader — simplex noise foam + cartoon wave lines
// Adapted from thaslle/stylized-water fragment approach
// Uses Ashima simplex noise (webgl-noise, public domain) for wave patterns
// Binary threshold for foam, breathing contour lines, UV vignette for depth

uniform float uTime;
uniform vec3 uColorNear;   // 0x0a2e3d dark teal
uniform vec3 uColorFar;    // 0x050d1a deep midnight
uniform float uFoamFreq;   // textureSize * 2.8
uniform vec2 uFoamThreshold; // smoothstep(0.08, 0.001)
uniform float uWaveLineThreshold; // 0.6

varying vec2 vUv;
varying vec3 vWorldPos;

// ─── Ashima simplex noise (webgl-noise/webgl-noise, MIT/Public Domain) ───
// This is the standard 3D simplex noise widely used across WebGL projects
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  // UV vignette — fake depth darkening toward edges
  // Stolen from thaslle: length(uv - 0.5) * 1.5
  float uvDist = length(vUv - 0.5) * 1.5;
  float depthFade = clamp(1.0 - uvDist, 0.0, 1.0);

  // Base color gradient: near (camera) to far (horizon)
  vec3 baseColor = mix(uColorNear, uColorFar, uvDist * 0.8);

  // Simplex noise for wave pattern
  float noiseScale = uFoamFreq;
  float n1 = snoise(vec3(vUv * noiseScale, uTime * 0.15));
  float n2 = snoise(vec3(vUv * noiseScale * 1.5 + 3.0, uTime * 0.12));
  float noise = (n1 + n2 * 0.5) * 0.67;

  // Foam — binary cartoon hardness
  // Research winner trick: smoothstep → step(0.5) for hard cartoon edges
  // "smoothstep(0.08, 0.001, noise) → step(0.5, result) = binary cartoon hardness"
  float foamSoft = smoothstep(uFoamThreshold.x, uFoamThreshold.y, noise);
  float foam = step(0.5, foamSoft); // binary snap — the cartoon trick

  // Foam dots at higher frequency (freq * 2.8 from winner)
  float dotNoise = snoise(vec3(vUv * noiseScale * 2.8, uTime * 0.08));
  float foamDots = step(0.5, smoothstep(0.08, 0.001, dotNoise));
  foam = max(foam, foamDots * 0.7);

  // Breathing wave contour lines
  // Stolen from thaslle: threshold oscillates with time
  float lineThreshold = uWaveLineThreshold + 0.01 * sin(uTime * 2.0);
  float waveLine = smoothstep(lineThreshold - 0.02, lineThreshold, noise)
                 * (1.0 - smoothstep(lineThreshold, lineThreshold + 0.02, noise));

  // Compose — foam is bright, wave lines are subtle
  vec3 foamColor = vec3(0.6, 0.7, 0.8); // cool white foam
  vec3 lineColor = mix(baseColor, vec3(0.3, 0.4, 0.5), 0.5);

  vec3 color = baseColor;
  color = mix(color, foamColor, foam * 0.4);
  color = mix(color, lineColor, waveLine * 0.3);

  // Apply depth darkening
  color *= depthFade * 0.8 + 0.2;

  // Slight sheen on surface
  float sheen = pow(max(0.0, 1.0 - uvDist), 3.0) * 0.08;
  color += vec3(sheen);

  gl_FragColor = vec4(color, 0.92); // slightly transparent
}
