// Starfish fragment shader — bumpy textured surface
// Adapted from daniel-ilett toon shader for underwater lighting

uniform vec3 uColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;
uniform float uBrightness;
uniform float uTextureFreq;  // surface bump detail frequency

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

// Simple procedural bump pattern (tube feet / ossicle texture)
float bumpPattern(vec2 p, float freq) {
  return 0.5 + 0.5 * sin(p.x * freq) * sin(p.y * freq * 1.3);
}

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Toon diffuse: 3-band (daniel-ilett)
  float NdotL = dot(normal, lightDir);
  float toon;
  if (NdotL > 0.5) {
    toon = 1.0;
  } else if (NdotL > 0.15) {
    toon = 0.65;
  } else {
    toon = 0.30;
  }

  // Procedural bump texture for tube feet pattern
  float bump = bumpPattern(vPosition.xz, uTextureFreq);
  vec3 surfaceColor = uColor * (0.8 + bump * 0.4);

  vec3 diffuse = surfaceColor * uSunColor * toon;

  // Rim light
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = smoothstep(0.6, 1.0, rim);
  vec3 rimColor = uSunColor * rim * 0.15;

  vec3 col = (diffuse + rimColor) * uBrightness;
  gl_FragColor = vec4(col, 1.0);
}
