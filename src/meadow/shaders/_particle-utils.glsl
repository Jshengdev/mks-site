// Perspective point-size scaling with distance attenuation
// Source: Alex-DG vite-three-webxr-flowers
// Used by: ash, dust, void, marine, angler, steam, snow, rain, petal vertex shaders

float perspectivePointSize(float baseSize, float viewZ, float scaleFactor) {
  return baseSize * (scaleFactor / -viewZ);
}
