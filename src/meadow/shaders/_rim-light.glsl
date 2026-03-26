// Fresnel rim light — Schlick's approximation
// Source: stemkoski Shader-Glow, daniel-ilett toon shader
// Used by: crystal, mushroom (vertex), flower, coral (fragment)

float fresnelRim(vec3 normal, vec3 viewDir, float power) {
  return pow(1.0 - max(dot(normal, viewDir), 0.0), power);
}
