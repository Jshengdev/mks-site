// CursorInteraction — Mouse→world raycast + cursor velocity for grass push
import * as THREE from 'three'

const GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const CURSOR_LERP = 0.12 // Smoothing factor for cursor world position

export default class CursorInteraction {
  constructor() {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2(-999, -999)
    this.worldPos = new THREE.Vector3(0, -100, 0) // off-screen default (smoothed)
    this.prevWorldPos = new THREE.Vector3(0, -100, 0)
    this.velocity = new THREE.Vector2(0, 0)
    this.speed = 0
    this.isOnGround = false
    this._initialized = false // skip lerp on first hit

    this._hitPoint = new THREE.Vector3()
    this._smoothedVelocity = new THREE.Vector2(0, 0)

    this._onMouseMove = (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    this._onMouseLeave = () => {
      this.mouse.set(-999, -999)
      this.isOnGround = false
      this._initialized = false  // reset so next entry doesn't lerp from old position
    }
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mouseleave', this._onMouseLeave)
  }

  update(camera, delta) {
    if (this.mouse.x < -10) {
      // Mouse off screen
      this.isOnGround = false
      this.speed *= 0.9 // decay
      return
    }

    this.raycaster.setFromCamera(this.mouse, camera)

    // Intersect with ground plane (y=0)
    const hit = this.raycaster.ray.intersectPlane(GROUND_PLANE, this._hitPoint)
    if (hit) {
      this.prevWorldPos.copy(this.worldPos)

      // Lerp worldPos toward hit for smooth grass push (no jitter)
      if (!this._initialized) {
        this.worldPos.copy(this._hitPoint)
        this._initialized = true
      } else {
        this.worldPos.lerp(this._hitPoint, CURSOR_LERP)
      }
      this.isOnGround = true

      if (delta > 0) {
        const rawVx = (this.worldPos.x - this.prevWorldPos.x) / delta
        const rawVz = (this.worldPos.z - this.prevWorldPos.z) / delta
        // Smooth velocity too to prevent jitter in grass wind direction
        this._smoothedVelocity.x += (rawVx - this._smoothedVelocity.x) * 0.2
        this._smoothedVelocity.y += (rawVz - this._smoothedVelocity.y) * 0.2
        this.velocity.copy(this._smoothedVelocity)
        this.speed = this.velocity.length()
      }
    } else {
      this.isOnGround = false
      this.speed *= 0.9
      this._smoothedVelocity.multiplyScalar(0.9)
    }
  }

  dispose() {
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('mouseleave', this._onMouseLeave)
  }
}
