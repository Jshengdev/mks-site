// Paper tree fragment shader — folded paper step lighting
// Adapted from lukysummer/7-Different-Shaders-Using-GLSL cel_shading_frag.glsl
// 4-band thresholds for paper tree (trees need more depth than grass)
// + Manurocker95/Toon-Shading silhouette edge detection

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

  // 4-band paper step lighting (lukysummer thresholds)
  // Trees need slightly more contrast than grass — deeper shadows on trunk
  float NdotL = dot(normal, lightDir);
  float lambertian;
  if (NdotL < 0.01) {
    lambertian = 0.45;     // deep fold shadow (trunk crevices)
  } else if (NdotL < 0.17) {
    lambertian = 0.62;     // shadow face
  } else if (NdotL < 0.55) {
    lambertian = 0.82;     // midtone crown face
  } else {
    lambertian = 1.0;      // fully lit crown tip
  }

  vec3 col = mix(uShadowColor, uColor, lambertian);

  // Silhouette edge detection (Manurocker95/Toon-Shading)
  // Paper fold edges where surface is perpendicular to view
  float silhouette = dot(viewDir, normal);
  float edgeDarken = 1.0 - smoothstep(0.0, 0.12, abs(silhouette));
  col -= edgeDarken * 0.10;

  gl_FragColor = vec4(col, 1.0);
}
