// src/meadow/CloudShadows.js
import * as THREE from 'three'
import cloudTextureUrl from '../assets/textures/cloud.jpg'

export default class CloudShadows {
  constructor(scene) {
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
    this.mesh.position.y = 3.0 // just above grass tips
    this.mesh.renderOrder = -1
    scene.add(this.mesh)
  }

  update(elapsed) {
    // Glacial cloud drift (from James-Smyth: iTime / 20000)
    this.texture.offset.x = elapsed * 0.00005
    this.texture.offset.y = elapsed * 0.0001
  }
}
