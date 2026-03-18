// Stone platform fragment shader — worn stone with hash noise texture
// Stolen from: stemkoski glow shader (rim light), al-ro grass (iquilez fog)
// Per-instance color variation via aInstanceColor attribute

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vInstanceColor;

uniform vec3 uLightDir;
uniform float uAmbient;

// Simple hash noise for stone texture variation
// Stolen from firefly.vert.glsl (L16 fBM pattern)
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 normal = normalize(vNormal);

  // Directional light — soft diffuse
  float NdotL = max(dot(normal, uLightDir), 0.0);

  // Stone surface noise — subtle grain based on world position
  // Two octaves: coarse block pattern + fine grain
  float coarseNoise = hash(floor(vWorldPos.xz * 2.0)) * 0.06;
  float fineNoise = hash(floor(vWorldPos.xz * 8.0)) * 0.03;
  float stoneTexture = coarseNoise + fineNoise;

  vec3 baseColor = vInstanceColor + stoneTexture;

  // Diffuse + ambient
  vec3 lit = baseColor * (NdotL * 0.5 + uAmbient);

  // Rim light for depth perception — stolen from stemkoski glow shader
  // c=0.2, p=3.0 adapted for stone (less glow than glass)
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
  lit += vec3(0.08, 0.08, 0.12) * rim; // cool blue-grey rim

  // Linear output — post-processing handles tonemapping + gamma
  gl_FragColor = vec4(lit, 1.0);
}
