#!/usr/bin/env node

/**
 * Generates a 33×33×33 .cube LUT file replicating the S-Log3 tone curve.
 * S-Log3 is Sony's logarithmic gamma curve for preserving dynamic range.
 *
 * Run: node scripts/generate-slog3-lut.js
 * Output: src/assets/luts/slog3-base.cube
 */

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// S-Log3 transfer function (Sony documentation)
function slog3(x) {
  if (x >= 0.01125) {
    return (420.0 + Math.log10((x + 0.01) / (0.18 + 0.01)) * 261.5) / 1023.0
  } else {
    return (x * (171.2102946929 - 95.0) / 0.01125 + 95.0) / 1023.0
  }
}

const SIZE = 33
const outputPath = resolve(__dirname, '../src/assets/luts/slog3-base.cube')

mkdirSync(dirname(outputPath), { recursive: true })

const lines = []
lines.push('TITLE "S-Log3 Base"')
lines.push('DOMAIN_MIN 0.0 0.0 0.0')
lines.push('DOMAIN_MAX 1.0 1.0 1.0')
lines.push(`LUT_3D_SIZE ${SIZE}`)
lines.push('')

for (let b = 0; b < SIZE; b++) {
  for (let g = 0; g < SIZE; g++) {
    for (let r = 0; r < SIZE; r++) {
      const ri = r / (SIZE - 1)
      const gi = g / (SIZE - 1)
      const bi = b / (SIZE - 1)

      const ro = slog3(ri)
      const go = slog3(gi)
      const bo = slog3(bi)

      lines.push(`${ro.toFixed(6)} ${go.toFixed(6)} ${bo.toFixed(6)}`)
    }
  }
}

writeFileSync(outputPath, lines.join('\n') + '\n')

const dataLines = lines.filter(l => l.match(/^\d/)).length
console.log(`Generated ${outputPath}`)
console.log(`  Size: ${SIZE}x${SIZE}x${SIZE}`)
console.log(`  Data lines: ${dataLines} (expected ${SIZE ** 3})`)
