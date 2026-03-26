// Fold lines — grid pattern on terrain surface like notebook paper
// Creates the impression that the terrain IS a sheet of paper
// Uses LineSegments geometry following terrain height
import * as THREE from 'three'

export default class FoldLine {
  constructor(scene, config, getTerrainHeight) {
    const spacing = config.spacing ?? 6
    const size = config.size ?? 160
    const color = config.color ?? '#c0bcb0'
    const opacity = config.opacity ?? 0.22
    const sampleStep = config.sampleStep ?? 2 // terrain sample interval

    const halfSize = size / 2
    const yOffset = 0.06 // slightly above terrain to prevent z-fighting

    const positions = []

    // X-parallel lines (horizontal rules — like notebook paper)
    for (let z = -halfSize; z <= halfSize; z += spacing) {
      for (let x = -halfSize; x < halfSize; x += sampleStep) {
        const x1 = x
        const x2 = Math.min(x + sampleStep, halfSize)
        const y1 = getTerrainHeight(x1, z) + yOffset
        const y2 = getTerrainHeight(x2, z) + yOffset
        positions.push(x1, y1, z, x2, y2, z)
      }
    }

    // Z-parallel lines (vertical rules — cross-hatching the paper)
    for (let x = -halfSize; x <= halfSize; x += spacing) {
      for (let z = -halfSize; z < halfSize; z += sampleStep) {
        const z1 = z
        const z2 = Math.min(z + sampleStep, halfSize)
        const y1 = getTerrainHeight(x, z1) + yOffset
        const y2 = getTerrainHeight(x, z2) + yOffset
        positions.push(x, y1, z1, x, y2, z2)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array(positions), 3))

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
    })

    this.lines = new THREE.LineSegments(geometry, material)
    this.scene = scene
    scene.add(this.lines)
  }

  dispose() {
    if (this.lines) this.scene.remove(this.lines)
    this.lines.geometry.dispose()
    this.lines.material.dispose()
  }
}
