// visual-tuner.mjs — Playwright-based screenshot automation for visual tuning
// Usage: node scripts/visual-tuner.mjs [--scroll=0.0-1.0] [--wait=2000]
// Takes screenshots at different scroll positions for visual evaluation
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import { join } from 'path'

const SCREENSHOT_DIR = join(import.meta.dirname, '..', 'screenshots')
const DEV_URL = 'http://localhost:5173'

// Scroll positions to capture (0=start, 1=end of meadow)
const SCROLL_POSITIONS = [0.0, 0.1, 0.25, 0.5, 0.75, 0.95]

async function captureScreenshots(opts = {}) {
  const wait = opts.wait || 3000
  const positions = opts.scroll != null ? [opts.scroll] : SCROLL_POSITIONS

  mkdirSync(SCREENSHOT_DIR, { recursive: true })

  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-webgl', '--ignore-gpu-blocklist'],
  })
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  await page.goto(DEV_URL, { waitUntil: 'networkidle' })
  // Wait for WebGL to initialize
  await page.waitForTimeout(wait)

  for (const pos of positions) {
    // Scroll to position using Lenis
    await page.evaluate((scrollPos) => {
      // Lenis exposes a scrollTo method; fallback to window.scrollTo
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo({ top: totalHeight * scrollPos, behavior: 'instant' })
    }, pos)

    // Wait for camera to settle (damped lerp)
    await page.waitForTimeout(1500)

    const filename = `meadow-${pos.toFixed(2).replace('.', '_')}.png`
    await page.screenshot({ path: join(SCREENSHOT_DIR, filename), fullPage: false })
    console.log(`Captured: ${filename} (scroll=${pos})`)
  }

  await browser.close()
  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`)
}

// Parse CLI args
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, v] = a.slice(2).split('=')
      return [k, v != null ? parseFloat(v) : true]
    })
)

captureScreenshots(args)
