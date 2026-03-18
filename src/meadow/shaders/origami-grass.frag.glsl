// Origami grass fragment shader — paper cutout lighting
// Adapted from daniel-ilett toon step-function technique
// Hard 2-band steps: paper is either lit or in shadow, no gradient

uniform vec3 uColor;        // cream lit face
uniform vec3 uShadowColor;  // darker cream shadow face
uniform vec3 uSunDirection;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);

  // 2-band hard step lighting — paper cutout feel (daniel-ilett technique)
  // No smoothstep. No gradient. Paper IS flat surfaces catching light.
  float NdotL = dot(normal, lightDir);
  float lit = step(0.15, NdotL);

  // Lit face = full cream, shadow face = darker cream
  vec3 col = mix(uShadowColor, uColor, lit);

  // Subtle edge brightening — paper edges catch light differently
  // (thin edge glow from rim lighting, very subtle)
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  float edgeGlow = step(0.85, rim) * 0.08;
  col += edgeGlow;

  gl_FragColor = vec4(col, 1.0);
}
