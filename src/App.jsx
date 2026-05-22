import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ArtistPage from "./pages/ArtistPage"
import TrackPage from "./pages/TrackPage"
import AlbumPage from "./pages/AlbumPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist/:id" element={<ArtistPage />} />
        <Route path="/track/:id" element={<TrackPage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App