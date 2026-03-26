// src/meadow/ArtistFigure.js
// 2D photographic cutout of Michael Kim Sheng projected as a billboard in 3D space
// Positioned at the far end of the meadow, looking up, feeling the music
import * as THREE from 'three'
import { getTerrainHeight as defaultGetTerrainHeight } from './TerrainPlane.js'

const _lookTarget = new THREE.Vector3()

export default class ArtistFigure {
  constructor(scene, getTerrainHeight) {
    this._scene = scene
    const heightFn = getTerrainHeight ?? defaultGetTerrainHeight

    // Position at the far end of the camera spline path
    // The spline ends at approximately z = -160, so place the figure at z = -145
    // (visible from the Deepening zone onward, you scroll toward him)
    const worldPos = new THREE.Vector3(2, 0, -145)
    worldPos.y = heightFn(worldPos.x, worldPos.z)

    // Tall, narrow plane — roughly human proportions
    const geometry = new THREE.PlaneGeometry(1.2, 2.4)
    // Shift geometry origin to bottom center (feet on ground)
    geometry.translate(0, 1.2, 0)

    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.0, // invisible until texture loaded
      side: THREE.DoubleSide,
      alphaTest: 0.1,
    })

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.copy(worldPos)
    scene.add(this.mesh)
  }

  loadTexture(url) {
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      this.texture = texture  // Store ref for disposal (AC3)
      this.mesh.material.map = texture
      this.mesh.material.opacity = 1.0
      this.mesh.material.needsUpdate = true
    })
  }

  update(cameraPosition) {
    // Billboard: always face the camera (Y-axis only — don't tilt)
    _lookTarget.set(
      cameraPosition.x,
      this.mesh.position.y + 1.2, // look at mid-height
      cameraPosition.z
    )
    this.mesh.lookAt(_lookTarget)
  }

  dispose() {
    this._scene.remove(this.mesh)
    if (this.texture) this.texture.dispose()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
