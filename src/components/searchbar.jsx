import { useState, useEffect } from "react"
import { search } from "../api/spotifyApi"

function SearchBar({ onResults, onLoading, initialQuery = "", initialType = "artist" }) {
  const [query, setQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState(initialType)

  useEffect(() => {
    setQuery(initialQuery)
    setSearchType(initialType)
  }, [initialQuery, initialType])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    onLoading(true)
    const data = await search(query, searchType)
    onResults(data, searchType, query)
    onLoading(false)
  }

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Sök artist, låt eller album..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Sök</button>
        </div>
        <div className="search-types">
          {["artist", "track", "album"].map(type => (
            <button
              key={type}
              type="button"
              className={`type-btn ${searchType === type ? "active" : ""}`}
              onClick={() => setSearchType(type)}
            >
              {type === "artist" ? "Artist" : type === "track" ? "Låt" : "Album"}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}

export default SearchBar