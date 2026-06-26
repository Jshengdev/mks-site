import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

// Embeds the engram fan-data page on michaelkimsheng.com.
// The browser URL stays on our domain; engram handles the form,
// the Meta pixel events, and the post-submit redirect inside the frame.
// Future events: link to /compose-with-me/<YYYY-MM-DD> — no code change needed.
const DEFAULT_EVENT = '2026-07-11'
const ENGRAM_BASE = 'https://michaelkimsheng.engram.sh/compose-with-me'

export default function ComposeWithMe() {
  const { date } = useParams()
  const event = date || DEFAULT_EVENT
  const src = `${ENGRAM_BASE}/${event}`

  useEffect(() => {
    document.title = 'Compose With Me — Michael Kim-Sheng'
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a' }}>
      <iframe
        src={src}
        title="Compose With Me — Michael Kim-Sheng"
        allow="clipboard-write; encrypted-media; payment"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  )
}
