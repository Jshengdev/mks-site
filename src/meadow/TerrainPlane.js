// src/meadow/TerrainPlane.js
import * as THREE from 'three'

// Grass base color from spacejack/terra
const TERRAIN_COLOR = new THREE.Color(0.45, 0.46, 0.19)

export function createTerrain(scene) {
  const geometry = new THREE.PlaneGeometry(400, 400, 128, 128)
  geometry.rotateX(-Math.PI / 2)

  // Gentle rolling hills via vertex displacement
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    // Low-frequency rolling hills
    const y = Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
      + Math.sin(x * 0.05 + z * 0.03) * 0.5
    pos.setY(i, y)
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshLambertMaterial({
    color: TERRAIN_COLOR,
    side: THREE.FrontSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  scene.add(mesh)

  return mesh
}

// Returns terrain height at world position (for placing objects)
export function getTerrainHeight(x, z) {
  return Math.sin(x * 0.02) * Math.cos(z * 0.015) * 2.0
    + Math.sin(x * 0.05 + z * 0.03) * 0.5
}
