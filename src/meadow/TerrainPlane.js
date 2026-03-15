// src/meadow/TerrainPlane.js
import * as THREE from 'three'

// Dark earth beneath grass (BotW ground tone — not black, dark olive)
const DEFAULT_TERRAIN_COLOR = new THREE.Color(0.16, 0.18, 0.07)

// Returns terrain height at world position (for placing objects)
export function getTerrainHeight(x, z) {
  return Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
    + Math.sin(x * 0.05 + z * 0.03) * 0.5
}

export function createTerrain(scene, envConfig = {}) {
  const terrainConfig = envConfig.terrain ?? {}
  const size = terrainConfig.size ?? 400

  const geometry = new THREE.PlaneGeometry(size, size, 128, 128)
  geometry.rotateX(-Math.PI / 2)

  // Gentle rolling hills via vertex displacement
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, getTerrainHeight(pos.getX(i), pos.getZ(i)))
  }
  geometry.computeVertexNormals()

  // Config-driven terrain color (per-environment)
  const color = terrainConfig.vertexColor
    ? new THREE.Color().setRGB(...terrainConfig.vertexColor)
    : DEFAULT_TERRAIN_COLOR

  const material = new THREE.MeshLambertMaterial({
    color,
    side: THREE.FrontSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  scene.add(mesh)

  return mesh
}
