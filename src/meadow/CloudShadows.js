// src/meadow/CloudShadows.js
import * as THREE from 'three'
import cloudTextureUrl from '../assets/textures/cloud.jpg'

const DEFAULT_DRIFT_SPEED = 0.00005

export default class CloudShadows {
  constructor(scene) {
    this._driftSpeed = DEFAULT_DRIFT_SPEED

    const loader = new THREE.TextureLoader()
    this.texture = loader.load(cloudTextureUrl)
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.wrapT = THREE.RepeatWrapping

    // Large plane just above terrain, alpha-blended
    const geometry = new THREE.PlaneGeometry(400, 400)
    geometry.rotateX(-Math.PI / 2)

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 0.15,
      blending: THREE.MultiplyBlending,
      depthWrite: false,
    })

    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.position.y = 3.0
    this.mesh.renderOrder = -1
    this.scene = scene
    scene.add(this.mesh)
  }

  update(elapsed) {
    this.texture.offset.x = elapsed * this._driftSpeed
    this.texture.offset.y = elapsed * this._driftSpeed * 2
  }

  dispose() {
    if (this.mesh) this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.material.dispose()
    this.texture.dispose()
  }
}
