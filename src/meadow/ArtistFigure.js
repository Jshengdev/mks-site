// src/meadow/ArtistFigure.js
// 2D photographic cutout of Michael Kim Sheng projected as a billboard in 3D space
// Positioned at the far end of the meadow, looking up, feeling the music
import * as THREE from 'three'
import { getTerrainHeight } from './TerrainPlane.js'

export default class ArtistFigure {
  constructor(scene) {
    this.scene = scene
    this.mesh = null

    // Position at the far end of the camera spline path
    // The spline ends at approximately z = -160, so place the figure at z = -145
    // (visible from the Deepening zone onward, you scroll toward him)
    this.worldPos = new THREE.Vector3(2, 0, -145)
    this.worldPos.y = getTerrainHeight(this.worldPos.x, this.worldPos.z)

    // Create a placeholder until the real photo is loaded
    this._createPlaceholder()
  }

  _createPlaceholder() {
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
    this.mesh.position.copy(this.worldPos)
    this.scene.add(this.mesh)
  }

  // Load the artist photo texture (alpha-masked cutout PNG)
  loadTexture(url) {
    const loader = new THREE.TextureLoader()
    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      this.mesh.material.map = texture
      this.mesh.material.opacity = 1.0
      this.mesh.material.needsUpdate = true
    })
  }

  update(cameraPosition) {
    if (!this.mesh) return
    // Billboard: always face the camera (Y-axis only — don't tilt)
    const lookTarget = new THREE.Vector3(
      cameraPosition.x,
      this.mesh.position.y + 1.2, // look at mid-height
      cameraPosition.z
    )
    this.mesh.lookAt(lookTarget)
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.mesh.material.dispose()
    }
  }
}
