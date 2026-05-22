import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { getArtist } from "../api/spotifyApi"

function ArtistPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  const previousState = location.state || null

  useEffect(() => {
    getArtist(id).then(data => {
      setArtist(data)
      setLoading(false)
    })
  }, [id])

  function goBack() {
    if (previousState) {
      navigate("/", { state: previousState })
    } else {
      navigate("/")
    }
  }

  if (loading) return <p className="loading">Laddar artist...</p>

  return (
    <div className="artist-page">
      <div className="artist-page-nav">
        <h1 className="logo nav-logo" onClick={() => navigate("/")}>Soundstat</h1>
        <button className="back-btn" onClick={goBack}>← Tillbaka till sökning</button>
      </div>

      <div className="artist-hero">
        <img
          src={artist.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={artist.name}
          className="artist-image"
        />
        <div className="artist-info">
          <h1 className="artist-name">{artist.name}</h1>
          <p className="artist-followers">
            {artist.followers?.total?.toLocaleString()} följare
          </p>
          <div className="artist-popularity">
            <span>Popularitet</span>
            <div className="popularity-bar">
              <div
                className="popularity-fill"
                style={{ width: `${artist.popularity}%` }}
              />
            </div>
            <span>{artist.popularity}/100</span>
          </div>
          <div className="artist-genres">
            {artist.genres?.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistPage