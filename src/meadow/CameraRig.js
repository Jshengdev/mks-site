// CameraRig — S-curve spline camera path driven by scroll progress
// Taste principle: Choreographed Camera Dance (CatmullRomCurve3 with lookAt ahead)
import * as THREE from 'three'

export default class CameraRig {
  constructor(camera) {
    this.camera = camera
    this.currentT = 0
    this.targetT = 0
    this.lerpFactor = 0.05 // heavy damping (floaty contemplativeness)

    // S-curve control points (world space, Z is forward into the meadow)
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.5, 0),
      new THREE.Vector3(6, 1.5, -25),
      new THREE.Vector3(-4, 1.5, -50),
      new THREE.Vector3(8, 1.5, -75),
      new THREE.Vector3(-6, 1.5, -100),
      new THREE.Vector3(4, 1.5, -130),
      new THREE.Vector3(0, 1.5, -160),
    ])
  }

  update(scrollProgress) {
    this.targetT = scrollProgress
    this.currentT += (this.targetT - this.currentT) * this.lerpFactor

    const pos = this.curve.getPoint(this.currentT)
    const lookTarget = this.curve.getPoint(Math.min(this.currentT + 0.01, 1.0))

    this.camera.position.copy(pos)
    this.camera.lookAt(lookTarget)
  }

  getPosition() {
    return this.curve.getPoint(this.currentT)
  }

  getCurrentT() {
    return this.currentT
  }
}
