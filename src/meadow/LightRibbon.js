// LightRibbon — flowing tube ribbons through void
// Stolen from: mdkq curl noise ribbons (simplex walk, mod=80),
// Codrops high-speed light trails (instanced tubes),
// mkkellogg TrailRendererJS (trail alpha fade)
import * as THREE from 'three'
import vertexShader from './shaders/lightRibbon.vert.glsl?raw'
import fragmentShader from './shaders/lightRibbon.frag.glsl?raw'

// Module-level reusable vectors (no per-frame allocations)
const _tangent = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _offset = new THREE.Vector3()
const _point = new THREE.Vector3()

export default class LightRibbon {
  constructor(scene, config = {}) {
    this.scene = scene
    const count = config.count ?? 5
    this.ribbons = []
    this._segments = 64
    this._controlPoints = 16
    this._ribbonWidth = config.radius ?? 0.15

    // Color palette — purple, cyan, amber, violet, blue
    // (mdkq whisp colors: 0x4deeea, 0x74ee15, 0xffe700, 0xf000ff, 0x001eff)
    const colors = [
      [0.545, 0.184, 0.788],  // deep violet
      [0.0, 0.831, 1.0],      // electric cyan
      [0.835, 0.792, 0.412],  // warm amber
      [0.706, 0.353, 1.0],    // lighter violet
      [0.2, 0.5, 0.9],        // steel blue
    ]

    const spread = config.spatialSpread ?? 40
    const vSpread = config.verticalSpread ?? 20

    for (let r = 0; r < count; r++) {
      // Generate initial control points — scattered through void
      const cx = (Math.random() - 0.5) * spread
      const cy = (Math.random() - 0.5) * vSpread
      const cz = -30 - Math.random() * 40

      const basePoints = []
      const curvePoints = []

      for (let i = 0; i < this._controlPoints; i++) {
        const frac = i / this._controlPoints
        const base = new THREE.Vector3(
          cx + (frac - 0.5) * spread * 0.6,
          cy + Math.sin(i * 0.8) * vSpread * 0.3,
          cz + (frac - 0.5) * 30
        )
        basePoints.push(base)
        curvePoints.push(base.clone()) // separate object for mutation
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints)
      const geometry = this._createRibbonGeometry()

      const material = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(...(colors[r % colors.length])) },
          uEmissiveIntensity: { value: config.emissiveIntensity ?? 1.5 },
          uBrightness: { value: 1.0 },
        },
        vertexShader,
        fragmentShader,
      })

      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      this.ribbons.push({
        mesh,
        material,
        geometry,
        curve,
        basePoints,
        phase: r * 1.7, // unique phase per ribbon (mdkq pattern)
      })
    }
  }

  _createRibbonGeometry() {
    const segments = this._segments
    const vertexCount = (segments + 1) * 2
    const positions = new Float32Array(vertexCount * 3)
    const uvs = new Float32Array(vertexCount * 2)
    const indices = []

    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      // Top edge
      uvs[(i * 2) * 2] = t
      uvs[(i * 2) * 2 + 1] = 0
      // Bottom edge
      uvs[(i * 2 + 1) * 2] = t
      uvs[(i * 2 + 1) * 2 + 1] = 1

      if (i < segments) {
        const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1
        indices.push(a, b, c, b, d, c)
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setIndex(indices)

    return geometry
  }

  update(elapsed) {
    for (const ribbon of this.ribbons) {
      ribbon.material.uniforms.uTime.value = elapsed
      this._evolveRibbon(ribbon, elapsed)
    }
  }

  _evolveRibbon(ribbon, time) {
    const { basePoints, curve, geometry, phase } = ribbon
    const segments = this._segments
    const width = this._ribbonWidth

    // Evolve control points in-place with layered sin/cos
    // (mdkq: simplex walk with mod=80, step=0.001 — we use sin layers for simplicity)
    for (let i = 0; i < this._controlPoints; i++) {
      const base = basePoints[i]
      const p = phase + i * 0.3
      curve.points[i].set(
        base.x + Math.sin(time * 0.3 + p) * 5 + Math.sin(time * 0.7 + p * 2.1) * 2,
        base.y + Math.cos(time * 0.4 + p * 1.3) * 4 + Math.sin(time * 0.5 + p * 0.7) * 2,
        base.z + Math.sin(time * 0.2 + p * 0.9) * 3
      )
    }

    const positions = geometry.attributes.position.array

    // Sample curve and build ribbon strip
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      curve.getPoint(t, _point)
      curve.getTangent(t, _tangent)

      // Perpendicular offset for ribbon width
      _right.crossVectors(_tangent, _up).normalize()
      if (_right.lengthSq() < 0.001) _right.set(1, 0, 0)
      _offset.copy(_right).multiplyScalar(width)

      // Top edge vertex
      const ti = i * 2
      positions[ti * 3] = _point.x + _offset.x
      positions[ti * 3 + 1] = _point.y + _offset.y
      positions[ti * 3 + 2] = _point.z + _offset.z

      // Bottom edge vertex
      const bi = i * 2 + 1
      positions[bi * 3] = _point.x - _offset.x
      positions[bi * 3 + 1] = _point.y - _offset.y
      positions[bi * 3 + 2] = _point.z - _offset.z
    }

    geometry.attributes.position.needsUpdate = true
    geometry.computeBoundingSphere()
  }

  dispose() {
    for (const { mesh, geometry, material } of this.ribbons) {
      this.scene.remove(mesh)
      geometry.dispose()
      material.dispose()
    }
  }
}
