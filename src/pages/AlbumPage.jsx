import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { getAlbum } from "../api/spotifyApi"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function msToMinSec(ms) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function getVibe(avgPopularity) {
  if (avgPopularity >= 80) return "🔥 Viral Album"
  if (avgPopularity >= 60) return "⚡ Hype Album"
  if (avgPopularity >= 40) return "🎵 Mainstream"
  if (avgPopularity >= 20) return "💎 Underground"
  return "🌙 Hidden Gem"
}

function AlbumPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const previousState = location.state || null

  useEffect(() => {
    getAlbum(id).then(data => {
      setAlbum(data)
      setLoading(false)
    })
  }, [id])

  function goBack() {
    previousState ? navigate("/", { state: previousState }) : navigate("/")
  }

  if (loading) return <p className="loading">Laddar album...</p>

  const tracks = album.tracks?.items || []
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration_ms, 0)
  const avgDuration = tracks.length ? totalDuration / tracks.length : 0
  const explicitCount = tracks.filter(t => t.explicit).length
  const explicitPct = tracks.length ? Math.round((explicitCount / tracks.length) * 100) : 0

  const barData = {
    labels: tracks.map((t, i) => `${i + 1}. ${t.name.length > 20 ? t.name.slice(0, 20) + "…" : t.name}`),
    datasets: [{
      label: "Låtlängd (sekunder)",
      data: tracks.map(t => Math.round(t.duration_ms / 1000)),
      backgroundColor: tracks.map((_, i) =>
        i % 2 === 0 ? "#00bda4" : "#0a8160"
      ),
      borderRadius: 6,
      borderSkipped: false,
    }]
  }

  const barOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#98ccd0", font: { size: 11 } },
        grid: { color: "rgba(0,189,164,0.1)" },
        border: { color: "rgba(0,189,164,0.2)" },
      },
      y: {
        ticks: { color: "#f1f5f9", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const sec = ctx.raw
            const m = Math.floor(sec / 60)
            const s = sec % 60
            return ` ${m}:${String(s).padStart(2, "0")}`
          }
        }
      }
    }
  }

  return (
    <div className="album-page">
      <div className="artist-page-nav">
        <h1 className="logo nav-logo" onClick={() => navigate("/")}>Soundstat</h1>
        <button className="back-btn" onClick={goBack}>← Tillbaka till sökning</button>
      </div>

      <div className="album-hero">
        <img
          src={album.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={album.name}
          className="album-cover"
        />
        <div className="album-info">
          <p className="album-type">{album.album_type?.toUpperCase()}</p>
          <h1 className="album-name">{album.name}</h1>
          <p className="album-artist">{album.artists?.map(a => a.name).join(", ")}</p>

          <div className="track-meta">
            <span className="meta-tag">📅 {album.release_date}</span>
            <span className="meta-tag">🎵 {album.tracks?.total} låtar</span>
            <span className="meta-tag">⏱ {msToMinSec(totalDuration)}</span>
            <span className="meta-tag">⌀ {msToMinSec(avgDuration)} snittlängd</span>
            {explicitCount > 0 && <span className="meta-tag explicit-tag">🔞 {explicitCount} explicita</span>}
          </div>

          <div className="vibe-badge">{getVibe(album.popularity || 0)}</div>
        </div>
      </div>

      <div className="album-content">
        <div className="tracklist-card">
          <h2 className="chart-title">Spårlista</h2>
          <div className="tracklist">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="tracklist-row"
                onClick={() => navigate(`/track/${track.id}`, { state: previousState })}
              >
                <span className="track-number">{index + 1}</span>
                <div className="tracklist-info">
                  <p className="tracklist-name">
                    {track.name}
                    {track.explicit && <span className="explicit-small"> E</span>}
                  </p>
                  <p className="tracklist-artists">{track.artists?.map(a => a.name).join(", ")}</p>
                </div>
                <span className="tracklist-duration">{msToMinSec(track.duration_ms)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="album-stats">
          <div className="chart-card">
            <h2 className="chart-title">Låtlängder</h2>
            <div style={{ height: `${Math.max(tracks.length * 36, 200)}px` }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h2 className="chart-title">Album-info</h2>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">Artist</span>
                <span className="detail-value">{album.artists?.map(a => a.name).join(", ")}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Släppt</span>
                <span className="detail-value">{album.release_date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Antal låtar</span>
                <span className="detail-value">{album.tracks?.total}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total längd</span>
                <span className="detail-value">{msToMinSec(totalDuration)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Snittlängd</span>
                <span className="detail-value">{msToMinSec(avgDuration)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Explicita låtar</span>
                <span className="detail-value">{explicitCount} ({explicitPct}%)</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Label</span>
                <span className="detail-value">{album.label || "Okänd"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumPage