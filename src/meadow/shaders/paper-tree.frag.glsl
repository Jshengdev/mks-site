// Paper tree fragment shader — folded paper step lighting
// Adapted from daniel-ilett/maya-ndljk toon shader
// 3-band step lighting for trees (slightly more detail than grass)
// Trunk gets slightly warmer shadow, crown stays cool

uniform vec3 uColor;          // cream/white base
uniform vec3 uShadowColor;    // fold shadow
uniform vec3 uSunDirection;
uniform vec3 uSunColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = gl_FrontFacing ? normalize(vNormal) : -normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // 3-band step lighting (daniel-ilett toon technique, adapted for paper)
  float NdotL = dot(normal, lightDir);
  float brightness;
  if (NdotL > 0.5) {
    brightness = 1.0;     // fully lit paper face
  } else if (NdotL > 0.0) {
    brightness = 0.75;    // angled face — partial shadow
  } else {
    brightness = 0.55;    // back face — deep fold shadow
  }

  vec3 col = mix(uShadowColor, uColor, brightness);

  // Paper edge silhouette — slight darkening at edges where paper folds
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  float edgeDarken = step(0.88, rim) * 0.06;
  col -= edgeDarken;

  gl_FragColor = vec4(col, 1.0);
}
