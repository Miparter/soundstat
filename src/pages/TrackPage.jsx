import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { getTrack } from "../api/spotifyApi"

function msToMinSec(ms) {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, "0")}`
}

function getVibe(popularity) {
  if (popularity >= 80) return "🔥 Viral"
  if (popularity >= 60) return "⚡ Hype"
  if (popularity >= 40) return "🎵 Mainstream"
  if (popularity >= 20) return "💎 Underground"
  return "🌙 Hidden Gem"
}

function PopularityGauge({ value }) {
  const radius = 80
  const stroke = 12
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const arc = circumference * 0.75
  const offset = arc - (value / 100) * arc

  const color = value >= 80 ? "#00bda4" : value >= 50 ? "#0a8160" : "#98ccd0"

  return (
    <div className="gauge-wrapper">
      <svg width={radius * 2} height={radius * 1.6} viewBox={`0 0 ${radius * 2} ${radius * 1.6}`}>
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#2a3a50"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${radius} ${radius})`}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${arc - offset} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(135 ${radius} ${radius})`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x={radius} y={radius + 8} textAnchor="middle" fill="#f1f5f9" fontSize="28" fontWeight="bold">{value}</text>
        <text x={radius} y={radius + 26} textAnchor="middle" fill="#98ccd0" fontSize="11">/100</text>
      </svg>
      <p className="gauge-label">Popularitet</p>
    </div>
  )
}

function DurationBar({ ms }) {
  const avgMs = 210000
  const pct = Math.min((ms / (avgMs * 2)) * 100, 100)
  const avgPct = 50

  return (
    <div className="duration-card">
      <p className="stat-card-title">Låtlängd</p>
      <p className="duration-big">{msToMinSec(ms)}</p>
      <div className="duration-bar-wrapper">
        <div className="duration-bar-bg">
          <div className="duration-bar-fill" style={{ width: `${pct}%` }} />
          <div className="duration-avg-marker" style={{ left: `${avgPct}%` }} />
        </div>
        <div className="duration-labels">
          <span>0:00</span>
          <span className="avg-label">⌀ 3:30</span>
          <span>7:00+</span>
        </div>
      </div>
    </div>
  )
}

function AlbumTimeline({ trackNumber, totalTracks, albumName }) {
  return (
    <div className="timeline-card">
      <p className="stat-card-title">Position i album</p>
      <p className="timeline-album">{albumName}</p>
      <div className="timeline-wrapper">
        {Array.from({ length: totalTracks }, (_, i) => (
          <div
            key={i}
            className={`timeline-dot ${i + 1 === trackNumber ? "active" : ""}`}
            title={`Spår ${i + 1}`}
          />
        ))}
      </div>
      <p className="timeline-label">Spår {trackNumber} av {totalTracks}</p>
    </div>
  )
}

function TrackPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const previousState = location.state || null

  useEffect(() => {
    getTrack(id).then(data => {
      setTrack(data)
      console.log("popularity:", data.popularity)
      setLoading(false)
    })
  }, [id])

  function goBack() {
    previousState ? navigate("/", { state: previousState }) : navigate("/")
  }

  if (loading) return <p className="loading">Laddar låt...</p>

  return (
    <div className="track-page">
      <div className="artist-page-nav">
        <h1 className="logo nav-logo" onClick={() => navigate("/")}>Soundstat</h1>
        <button className="back-btn" onClick={goBack}>← Tillbaka till sökning</button>
      </div>

      <div className="track-hero">
        <img
          src={track.album?.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={track.name}
          className="track-album-cover"
        />
        <div className="track-info">
          <p className="track-album-name">{track.album?.name}</p>
          <h1 className="track-name">{track.name}</h1>
          <p className="track-artist">{track.artists?.map(a => a.name).join(", ")}</p>
          <div className="track-meta">
            <span className="meta-tag">⏱ {msToMinSec(track.duration_ms)}</span>
            <span className="meta-tag">📅 {track.album?.release_date?.slice(0, 4)}</span>
            <span className="meta-tag">🔥 {track.popularity}/100</span>
            <span className="meta-tag">💿 Spår {track.track_number} av {track.album?.total_tracks}</span>
            {track.explicit && <span className="meta-tag explicit-tag">🔞 Explicit</span>}
          </div>
          <div className="vibe-badge">{getVibe(track.popularity)}</div>
          <div className="play-placeholder">
            <span>🎵 Uppspelning kommer snart</span>
          </div>
        </div>
      </div>

      <div className="track-stats-grid">
        <PopularityGauge value={track.popularity || 0} />
        <DurationBar ms={track.duration_ms} />
        <AlbumTimeline
          trackNumber={track.track_number}
          totalTracks={track.album?.total_tracks}
          albumName={track.album?.name}
        />
      </div>

      <div className="chart-card detail-card">
        <h2 className="chart-title">Detaljer</h2>
        <div className="detail-list">
          {[
            { label: "Album", value: track.album?.name },
            { label: "Artist", value: track.artists?.map(a => a.name).join(", ") },
            { label: "Släppt", value: track.album?.release_date },
            { label: "Längd", value: msToMinSec(track.duration_ms) },
            { label: "Spårnummer", value: `${track.track_number} av ${track.album?.total_tracks}` },
            { label: "Explicit", value: track.explicit ? "Ja" : "Nej" },
            { label: "Spotify ID", value: track.id },
          ].map(row => (
            <div key={row.label} className="detail-row">
              <span className="detail-label">{row.label}</span>
              <span className="detail-value muted-small">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrackPage