// Lava crack fragment shader — pulsing molten glow through terrain fissures
// Color ramp stolen from Ppratik765/liquid-lava-effect
// FBM noise pattern stolen from mrdoob/three.js webgl_shader_lava
// Pulsing technique: brightness oscillates like cooling lava
uniform float uTime;
uniform float uPulseSpeed;
uniform float uPulseIntensity;
uniform vec3 uMoltenColor;      // deep molten orange (1.0, 0.27, 0.0)
uniform vec3 uGlowColor;        // bright emission (1.0, 0.53, 0.0)
uniform vec3 uCrustColor;       // cooled dark basalt (0.10, 0.04, 0.02)

varying vec2 vUv;
varying vec3 vWorldPos;

// FBM noise stolen from Ppratik765/liquid-lava-effect
float hash2D(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash2D(i), hash2D(i + vec2(1.0, 0.0)), f.x),
    mix(hash2D(i + vec2(0.0, 1.0)), hash2D(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  v += 0.50 * noise2D(p); p *= 2.01;
  v += 0.25 * noise2D(p); p *= 2.02;
  v += 0.125 * noise2D(p);
  return v;
}

void main() {
  // UV along the crack strip: x=across width, y=along length
  float edgeFade = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 2.0); // bright center, dark edges

  // FBM crust noise — stolen from Ppratik765
  // World-space sampling so each crack has unique pattern
  float crustNoise = fbm(vWorldPos.xz * 1.8 + uTime * 0.05);

  // Pulsing glow — oscillates like cooling/heating lava
  // Multiple overlapping sine waves for organic feel
  // Stolen from Ppratik765 flow distortion concept
  float pulse = 0.6 + uPulseIntensity * (
    0.5 * sin(uTime * uPulseSpeed + vWorldPos.x * 0.3) +
    0.3 * sin(uTime * uPulseSpeed * 1.7 + vWorldPos.z * 0.5) +
    0.2 * sin(uTime * uPulseSpeed * 0.6 + crustNoise * 6.0)
  );

  // Heat map: center of crack is hottest, edges cool
  float heat = edgeFade * pulse;

  // 3-stop color ramp stolen from Ppratik765
  // Crust → molten → glow (hot)
  vec3 color = mix(uCrustColor, uMoltenColor, smoothstep(0.0, 0.4, heat));
  color = mix(color, uGlowColor, smoothstep(0.4, 0.85, heat));

  // White-hot core — channel overflow technique from mrdoob lava shader
  // "if temp.r > 1.0, bleed into other channels"
  float whiteHot = smoothstep(0.85, 1.0, heat) * 0.4;
  color += vec3(whiteHot, whiteHot * 0.8, whiteHot * 0.3);

  // Noise breaks up the uniform glow — creates crust texture
  float crustBreak = smoothstep(0.35, 0.55, crustNoise);
  color = mix(color, uCrustColor, crustBreak * 0.4 * (1.0 - heat));

  // Alpha: bright core, fading edges + length taper at ends
  float lengthFade = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
  float alpha = edgeFade * lengthFade * (0.5 + heat * 0.5);

  gl_FragColor = vec4(color, alpha);
}
