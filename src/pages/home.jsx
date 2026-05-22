import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import SearchBar from "../components/SearchBar"

function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState("artist")
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.results) {
      setResults(location.state.results)
      setSearchType(location.state.searchType)
      setQuery(location.state.query)
    }
  }, [])

  function handleResults(data, type, searchQuery) {
    setResults(data)
    setSearchType(type)
    setQuery(searchQuery)
  }

  function handleCardClick(item) {
    if (searchType === "artist") {
      navigate(`/artist/${item.id}`, { state: { results, searchType, query } })
    }
    if (searchType === "track") {
      navigate(`/track/${item.id}`, { state: { results, searchType, query } })
    }
    if (searchType === "album") {
      navigate(`/album/${item.id}`, { state: { results, searchType, query } })
    }
  }

  function getItems() {
    if (!results) return []
    if (searchType === "artist") return results.artists?.items || []
    if (searchType === "track") return results.tracks?.items || []
    if (searchType === "album") return results.albums?.items || []
    return []
  }

  return (
    <div className="home">
      <div className="hero">
        <h1 className="logo" onClick={() => { setResults(null); setQuery("") }} style={{ cursor: "pointer" }}>Soundstat</h1>
        <p className="tagline">Utforska musiken bakom musiken</p>
        <SearchBar
          onResults={handleResults}
          onLoading={setLoading}
          initialQuery={query}
          initialType={searchType}
        />
      </div>

      {loading && <p className="loading">Söker...</p>}

      {results && (
        <div className="results-grid">
          {getItems().map(item => (
            <div
              key={item.id}
              className="result-card"
              onClick={() => handleCardClick(item)}
            >
              <img
                src={
                  item.images?.[0]?.url ||
                  item.album?.images?.[0]?.url ||
                  "https://via.placeholder.com/150"
                }
                alt={item.name}
                className="card-image"
              />
              <div className="card-info">
                <p className="card-name">{item.name}</p>
                <p className="card-sub">
                  {searchType === "artist" && `${item.followers?.total?.toLocaleString()} följare`}
                  {searchType === "track" && item.artists?.[0]?.name}
                  {searchType === "album" && item.release_date?.slice(0, 4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home