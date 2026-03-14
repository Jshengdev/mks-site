// src/meadow/PortalHint.js
// Shimmering portal spots in the meadow that hint at future worlds
import * as THREE from 'three'
import { getTerrainHeight } from './TerrainPlane.js'
import vertexShader from './shaders/portal.vert.glsl?raw'
import fragmentShader from './shaders/portal.frag.glsl?raw'

const PORTAL_CONFIGS = [
  {
    worldPos: [8, 0, -55],    // Visible during Alive zone
    color: [0.3, 0.5, 0.8],   // Cool blue — "The Search"
    label: 'The Search',
  },
  {
    worldPos: [-6, 0, -95],   // Visible during Deepening zone
    color: [0.8, 0.6, 0.3],   // Warm amber — "Bittersweet Letting Go"
    label: 'Bittersweet Letting Go',
  },
  {
    worldPos: [5, 0, -125],   // Visible near the end
    color: [0.7, 0.7, 0.85],  // Cool lavender — "The Final Breath"
    label: 'The Final Breath',
  },
]

const _mouse = new THREE.Vector2()

export default class PortalHint {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.portals = []
    this.raycaster = new THREE.Raycaster()

    for (const config of PORTAL_CONFIGS) {
      const geometry = new THREE.PlaneGeometry(2, 4)
      // Shift origin to bottom center
      geometry.translate(0, 2, 0)

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(...config.color) },
          uOpacity: { value: 0.6 },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      const mesh = new THREE.Mesh(geometry, material)
      const [x, , z] = config.worldPos
      const y = getTerrainHeight(x, z)
      mesh.position.set(x, y, z)
      mesh.userData.label = config.label

      scene.add(mesh)
      this.portals.push({ mesh, config })
    }

    // Click handler
    this._onClick = this._onClick.bind(this)
    window.addEventListener('click', this._onClick)
  }

  update(elapsed) {
    for (const { mesh } of this.portals) {
      mesh.material.uniforms.uTime.value = elapsed
      // Billboard toward camera (Y-axis only)
      mesh.lookAt(
        this.camera.position.x,
        mesh.position.y + 2,
        this.camera.position.z
      )
    }
  }

  _onClick(event) {
    _mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    _mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(_mouse, this.camera)

    const meshes = this.portals.map(p => p.mesh)
    const hits = this.raycaster.intersectObjects(meshes)

    if (hits.length > 0) {
      const label = hits[0].object.userData.label
      this._showComingSoon(label)
    }
  }

  _showComingSoon(label) {
    // Simple overlay — can be upgraded to a proper React modal later
    let overlay = document.getElementById('portal-overlay')
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'portal-overlay'
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 8000;
        background: rgba(10,10,10,0.85); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        font-family: 'DM Sans', sans-serif; cursor: pointer;
      `
      overlay.addEventListener('click', () => overlay.remove())
      document.body.appendChild(overlay)
    }
    overlay.innerHTML = `
      <div style="text-align:center; color:#c8d4e8;">
        <div style="font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:#5a6a6a; margin-bottom:12px;">THIS WORLD IS BEING COMPOSED</div>
        <div style="font-size:24px; font-weight:300; letter-spacing:0.05em; margin-bottom:8px;">${label}</div>
        <div style="font-size:12px; color:#5a6a6a;">Click anywhere to return</div>
      </div>
    `
  }

  dispose() {
    window.removeEventListener('click', this._onClick)
    for (const { mesh } of this.portals) {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
    const overlay = document.getElementById('portal-overlay')
    if (overlay) overlay.remove()
  }
}
