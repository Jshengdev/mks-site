// Caustic projection fragment shader — Tide Pool + Crystal Cavern prismatic mode
// Technique: 3 overlapping procedural noise layers create caustic light patterns
// Projected onto all surfaces using world-space XZ coordinates
//
// Stolen from:
//   - Shadertoy MdlXz8 by Dave_Hoskins — tileable water caustic using
//     mixed cos/sin waves at different scales that tile because wavelength
//     multiples fit the tile size
//   - martinRenou/threejs-caustics — real-time caustic computation via
//     light ray refraction through deformed water surface
//   - pabennett/WaterCaustics — photon map approach, inverse area brightness
//   - Varun Vachhar — iquilez cosine palette for prismatic spectral bands
//
// The key insight: caustics = where refracted light rays CONVERGE.
// We approximate this by taking smooth Voronoi-like noise fields,
// overlapping them at different scales/speeds, and raising the
// intersection to a power. Bright where noise layers align (ray convergence),
// dark everywhere else.
//
// PRISMATIC MODE (crystal cavern): 3 existing layers map to 3 spectral bands
// (warm/mid/cool) via iquilez cosine palette. No extra noise evaluations.
// Where layers align = white. Where offset = colored rainbow fringes.

precision highp float;

uniform float uTime;
uniform float uFrequency;       // base caustic pattern density (8.0)
uniform float uSpeed;           // animation speed (0.3)
uniform float uIntensity;       // overall brightness (0.7)
uniform float uSharpness;       // pow() exponent for line thinness (3.0)
uniform float uDepthFade;       // how quickly caustics dim with depth (0.12)
uniform vec3 uCausticColor;     // tint color (0.6, 0.85, 0.95)
uniform float uSurfaceHeight;   // water surface Y
uniform vec3 uAbsorption;       // RGB absorption rates per unit depth
uniform float uPrismatic;       // 0 = mono underwater, 1 = crystal prismatic rainbow

varying vec3 vWorldPos;
varying float vDepth;

// --- Ashima simplex noise (same as grass shader, from Ashima/webgl-noise) ---
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// 2D simplex noise — Ashima/webgl-noise (MIT license)
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

// iquilez cosine palette — prismatic spectrum for crystal caustics
// Source: Varun Vachhar — same palette used in crystal.frag.glsl
vec3 spectrum(float t) {
  return vec3(0.5) + vec3(0.5) * cos(6.28318 * (vec3(1.0) * t + vec3(0.0, 0.33, 0.67)));
}

// --- Dave_Hoskins tileable caustic technique ---
// Multiple noise layers at fibonacci-ish frequency ratios.
// The "caustic" emerges from taking the MAX of overlapping noise fields
// and sharpening with pow(). Where two noise ridges align = bright line.
// Where they don't = dark. This simulates light ray convergence.

float causticLayer(vec2 uv, float freq, float speed) {
  float t = uTime * speed;
  // Two noise samples at slightly different offsets create an interference pattern
  float n1 = snoise(uv * freq + vec2(t * 0.7, t * -0.5));
  float n2 = snoise(uv * freq * 1.3 + vec2(t * -0.4, t * 0.6) + vec2(17.3, 42.7));
  // Caustic = where both noise fields are positive (constructive interference)
  // This creates bright lines where refracted light rays converge
  float caustic = max(0.0, n1) * max(0.0, n2);
  return caustic;
}

void main() {
  // World-space XZ coordinates for projection (Y is depth)
  vec2 projUV = vWorldPos.xz;

  // Prismatic mode: slow UV drift from underground convection currents
  // Creates lazy breathing movement — the patterns are alive, not frozen
  if (uPrismatic > 0.5) {
    float drift = uTime * 0.015;
    projUV += vec2(sin(drift * 0.7) * 0.3, cos(drift * 0.5) * 0.2);
  }

  // --- 3-layer caustic computation ---
  // Layer frequencies: 1.0, 1.7, 2.3 (fibonacci-ish — avoids perfect overlap)
  // Layer speeds: 0.3, -0.2, 0.15 (different directions for richness)
  float layer1 = causticLayer(projUV, uFrequency * 1.0, uSpeed * 1.0);
  float layer2 = causticLayer(projUV, uFrequency * 1.7, uSpeed * -0.67);
  float layer3 = causticLayer(projUV, uFrequency * 2.3, uSpeed * 0.5);

  // --- Depth-based fade ---
  // Caustics dim with depth because scattered light loses coherence
  float depthFade = exp(-vDepth * uDepthFade * 10.0);

  vec3 causticLight;
  float alpha;

  if (uPrismatic > 0.5) {
    // ─── PRISMATIC MODE (crystal cavern) ───
    // 3 existing layers → 3 spectral bands via iquilez cosine palette.
    // NO extra noise evaluations — the 3 layers already run at different
    // frequencies/speeds. Mapping them to warm/mid/cool spectral bands
    // naturally creates rainbow where layers are offset, white where aligned.
    //
    // Layer1 (largest/slowest, freq=1.0) → warm amber-red
    // Layer2 (medium, freq=1.7) → teal-green
    // Layer3 (smallest/fastest, freq=2.3) → blue-violet
    vec3 warm = spectrum(0.05);   // amber-red
    vec3 mid  = spectrum(0.35);   // teal-green
    vec3 cool = spectrum(0.65);   // blue-violet

    // Scale layers before pow() — tighter range produces cleaner lines
    vec3 prismatic = warm * pow(max(layer1 * 0.6, 0.0), uSharpness) * 0.45
                   + mid  * pow(max(layer2 * 0.6, 0.0), uSharpness) * 0.35
                   + cool * pow(max(layer3 * 0.6, 0.0), uSharpness) * 0.20;

    causticLight = prismatic * uIntensity * depthFade;
    alpha = (prismatic.r + prismatic.g + prismatic.b) * 0.33 * uIntensity * depthFade;
  } else {
    // ─── STANDARD MODE (tide pool, underwater) ───
    // Combine: additive blend with diminishing contribution
    float caustic = layer1 * 0.5 + layer2 * 0.3 + layer3 * 0.2;

    // Sharpen — pow() concentrates energy into thin bright lines
    // This is the "inverse area" brightness from pabennett/WaterCaustics:
    // where light converges, intensity spikes
    caustic = pow(caustic, uSharpness);
    caustic *= depthFade;

    // Color absorption model — red absorbed first, green next, blue last
    // Based on hughsk/glsl-fog absorption model
    float depth = vDepth * uSurfaceHeight;
    vec3 absorption = exp(-uAbsorption * depth);

    causticLight = uCausticColor * caustic * uIntensity * absorption;
    alpha = caustic * uIntensity * depthFade;
  }

  // Output: additive light contribution
  // Composited onto the scene as additive blending
  gl_FragColor = vec4(causticLight, alpha);
}
