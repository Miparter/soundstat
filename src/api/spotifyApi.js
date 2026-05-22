const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

export async function search(query, type = "artist") {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.json();
}

export async function getArtist(artistId) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.json();
}

export async function getTopTracks(artistId) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=SE`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.json();
}

export async function getAudioFeatures(trackId) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${trackId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.json();
}

export async function getTrack(trackId) {
  const token = await getAccessToken()
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}?market=SE`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return await response.json()
}

export async function getAlbum(albumId) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.json();
}

export async function getAudioFeaturesMultiple(trackIds) {
  const token = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return await response.json();
}