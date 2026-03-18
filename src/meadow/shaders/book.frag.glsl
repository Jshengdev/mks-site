// Floating book fragment shader — cream pages, dark spine
// Adapted from daniel-ilett toon pattern (2-band diffuse)
uniform vec3 uPageColor;
uniform vec3 uSpineColor;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform float uAmbient;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vSpineFactor;

void main() {
  vec3 normal = normalize(vNormal);

  // Spine vs page/cover color (from local position in vertex shader)
  vec3 baseColor = mix(uPageColor, uSpineColor, vSpineFactor);

  // Warm directional lighting (soft 2-band toon)
  float NdotL = max(dot(normal, normalize(uLightDir)), 0.0);
  float toon = NdotL > 0.4 ? 1.0 : 0.65;

  vec3 diffuse = baseColor * uLightColor * toon;
  vec3 ambient = baseColor * uAmbient;

  // Slight warm rim to catch bloom from nearby lamp orbs
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = smoothstep(0.7, 1.0, rim);
  vec3 rimColor = uLightColor * rim * 0.08;

  gl_FragColor = vec4(diffuse + ambient + rimColor, 1.0);
}
