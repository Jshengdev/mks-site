// Exponential distance fog — iquilez technique
// Source: al-ro/grass (WebGL), iquilez.org/articles/fog
// Used by: kelp, coral, wilting-grass fragment shaders

float expFogFactor(float dist, float density) {
  return 1.0 - exp(-dist * density);
}

vec3 applyExpFog(vec3 color, vec3 fogColor, float dist, float density) {
  return mix(color, fogColor, expFogFactor(dist, density));
}
