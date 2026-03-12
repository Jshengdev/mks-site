// Toon shading — adapted from daniel-ilett/maya-ndljk toon shader
// Step function lighting with 2-3 tone bands + rim light
uniform vec3 uColor;
uniform vec3 uSunDirection;
uniform vec3 uSunColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uSunDirection);
  vec3 viewDir = normalize(cameraPosition - vPosition);

  // Toon diffuse: 3-band step function
  float NdotL = dot(normal, lightDir);
  float toon;
  if (NdotL > 0.6) {
    toon = 1.0;
  } else if (NdotL > 0.2) {
    toon = 0.7;
  } else {
    toon = 0.4;
  }

  vec3 diffuse = uColor * uSunColor * toon;

  // Rim light (BotW edge glow)
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  rim = smoothstep(0.6, 1.0, rim);
  vec3 rimColor = uSunColor * rim * 0.3;

  vec3 col = diffuse + rimColor;

  // Tonemapping + gamma handled by renderer/post-processing pipeline

  gl_FragColor = vec4(col, 1.0);
}
