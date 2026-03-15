// Lava lake fragment shader — cooling crust over molten magma
// Adapted from thaslle/stylized-water (ocean.frag.glsl) + three.js webgl_shader_lava
// Simplex noise creates cooling crust patterns; gaps reveal molten orange beneath
// Sources: Ashima simplex (webgl-noise, public domain), DenizTC/GLSL-Lava-Shader concepts

uniform float uTime;
uniform vec3 uCrustColor;      // 0x1a0a05 — cooled dark basalt crust
uniform vec3 uMoltenColor;     // 0xff4400 — deep molten orange
uniform vec3 uGlowColor;       // 0xff8800 — bright emission from cracks
uniform float uCrustFreq;      // 1.8 — noise frequency for crust pattern
uniform float uCrustThreshold; // 0.35 — how much crust vs molten (higher = more crust)
uniform float uPulseSpeed;     // 0.3 — slow throb of molten glow
uniform float uPulseIntensity; // 0.4 — how much the glow pulses
uniform float uEmissive;       // 1.5 — overall emission multiplier (atmosphere-driven)

varying vec2 vUv;
varying vec3 vWorldPos;

// ─── Ashima simplex noise (webgl-noise, MIT/Public Domain) ───
// Same implementation as ocean.frag.glsl — shared across the codebase
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
  // ─── Cooling crust pattern ───
  // Two octaves of simplex noise at different speeds create irregular crust plates
  // Slower time scale than water — magma is viscous (0.05 vs 0.15)
  float n1 = snoise(vec3(vUv * uCrustFreq, uTime * 0.05));
  float n2 = snoise(vec3(vUv * uCrustFreq * 1.7 + 5.0, uTime * 0.03));
  float noise = (n1 + n2 * 0.5) * 0.67;

  // Crust mask — where noise is above threshold, crust has formed
  // Below threshold = molten veins visible between crust plates
  float crustMask = smoothstep(uCrustThreshold - 0.1, uCrustThreshold + 0.05, noise);

  // ─── Molten vein intensity ───
  // Veins glow brightest at the crust edges (where crust is thin)
  // Adapted from DenizTC: "lava height fluctuates with sinusoidal wave"
  float veinIntensity = 1.0 - crustMask;
  float edgeGlow = smoothstep(uCrustThreshold - 0.15, uCrustThreshold, noise)
                 * (1.0 - smoothstep(uCrustThreshold, uCrustThreshold + 0.15, noise));

  // ─── Pulsing glow ───
  // The molten areas throb slowly — the volcano breathes
  float pulse = 1.0 + sin(uTime * uPulseSpeed) * uPulseIntensity;
  float pulse2 = 1.0 + sin(uTime * uPulseSpeed * 0.7 + 2.0) * uPulseIntensity * 0.5;

  // ─── UV vignette — center of crater glows hottest ───
  float uvDist = length(vUv - 0.5) * 2.0;
  float centerHeat = 1.0 - uvDist * 0.4; // hotter toward center

  // ─── Compose color ───
  // Crust: dark cooled basalt
  // Veins: molten orange, pulsing
  // Edge glow: bright emission where crust meets magma
  vec3 molten = uMoltenColor * pulse * centerHeat;
  vec3 glow = uGlowColor * edgeGlow * pulse2 * 2.0;
  vec3 crust = uCrustColor;

  vec3 color = mix(molten + glow, crust, crustMask);

  // Emissive multiplier — atmosphere-driven, controls overall lava brightness
  color *= uEmissive;

  // Slight surface variation — high-frequency noise for texture
  float detail = snoise(vec3(vUv * uCrustFreq * 4.0, uTime * 0.02)) * 0.08;
  color += vec3(detail * (1.0 - crustMask)); // only on molten areas

  gl_FragColor = vec4(color, 0.95);
}
