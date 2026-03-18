// Dissolving flower fragment shader — noise-based discard + edge glow
// Dissolve pattern stolen from transition.frag.glsl (brushDissolve)
// Edge glow technique from Harry Alisavakis dissolve shader
// Toon lighting from daniel-ilett/maya-ndljk
uniform vec3 uColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform vec3 uEdgeColor;     // glow color at dissolve boundary
uniform float uEdgeWidth;    // width of dissolve edge glow

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLocalPos;
varying float vLifecycle;
varying float vScale;

// Stolen from transition.frag.glsl — Inigo Quiléz hash noise
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  // ─── Dissolve ───
  // Multi-octave noise (stolen from brushDissolve in transition.frag.glsl)
  vec2 noiseUV = vLocalPos.xz * 3.5 + vLocalPos.y * 2.0;
  float n = noise(noiseUV * 4.0) * 0.5
          + noise(noiseUV * 8.0) * 0.25
          + noise(noiseUV * 16.0) * 0.125;

  // Dissolve threshold ramps up during decay phase (t=0.6 → 1.0)
  float dissolveProgress = smoothstep(0.55, 0.95, vLifecycle);
  float threshold = dissolveProgress * 1.4 - 0.1;

  // Discard fragments below threshold (the actual dissolve)
  if (n < threshold) discard;

  // ─── Edge glow (Harry Alisavakis burn edge technique) ───
  float edgeDist = n - threshold;
  float edgeGlow = 1.0 - smoothstep(0.0, uEdgeWidth, edgeDist);
  edgeGlow *= dissolveProgress; // only glow during dissolve phase

  // ─── Toon lighting (stolen from daniel-ilett) ───
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);
  float NdotL = dot(normal, lightDir);
  float toon;
  if (NdotL > 0.5) {
    toon = 0.9;
  } else if (NdotL > 0.1) {
    toon = 0.6;
  } else {
    toon = 0.35; // darker shadow band — dying flowers
  }

  vec3 diffuse = uColor * uSunColor * toon;

  // Rim light (dimmer than healthy flowers)
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = smoothstep(0.7, 1.0, rim);
  vec3 rimColor = uSunColor * rim * 0.15;

  // Combine: base + rim + dissolve edge glow
  vec3 col = diffuse + rimColor;
  col = mix(col, uEdgeColor, edgeGlow * 0.8); // edge glow blend

  // Fade alpha during early dissolve for softness
  float alpha = 1.0 - smoothstep(0.7, 1.0, vLifecycle) * 0.5;

  gl_FragColor = vec4(col, alpha);
}
