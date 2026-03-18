// Floating shelf fragment shader — dark aged wood with gold accent edges
// Adapted from daniel-ilett toon pattern
uniform vec3 uWoodColor;
uniform vec3 uGoldAccent;
uniform vec3 uLightColor;
uniform float uAmbient;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec3 vLocalPos;

void main() {
  vec3 normal = normalize(vNormal);

  // Gold accent at shelf edges (ends of the plank)
  float edgeFactor = smoothstep(3.5, 5.0, abs(vLocalPos.x));
  vec3 baseColor = mix(uWoodColor, uGoldAccent, edgeFactor * 0.3);

  // Top face slightly lighter (aged polish catching lamplight)
  float topFace = max(0.0, normal.y);
  baseColor += topFace * 0.05;

  // Warm directional lighting (soft 2-band)
  vec3 lightDir = normalize(vec3(0.2, 0.8, 0.3));
  float NdotL = max(dot(normal, lightDir), 0.0);
  float toon = NdotL > 0.3 ? 1.0 : 0.55;

  vec3 diffuse = baseColor * uLightColor * toon;
  vec3 ambient = baseColor * uAmbient;

  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
