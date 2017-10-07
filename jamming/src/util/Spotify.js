let accessToken;
const clientId = '34d73d1fbae84af0a80902324a1ff9f2';
const secret = '67883d2921ff42c1a1b98b7c3a858b80';
const localRedirect = 'http://localhost:3000/';
const redirect = 'http://rachelklingelhofersjamming.surge.sh';

let Spotify = {
  getAccessToken() {
    if(accessToken) {
      return new Promise(resolve => resolve(accessToken));
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/);
      let expiration = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expiration * 1000);
      return new Promise(resolve => resolve(accessToken));
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect}`;
    }
  },

  search(term) {
    return Spotify.getAccessToken().then(() => fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
    {headers: {Authorization: `Bearer ${accessToken[1]}`}}))
    .then(response => response.json())
    .then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        })
      );
    } return []; })
  },

  savePlaylist(name, uris) {
    if(name && uris) {
      Spotify.getAccessToken();
      let headers = { Authorization: `Bearer ${accessToken[1]}` };
      let userId;
      let playlistId;
      return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
      .then(response => response.json())
      .then(jsonResponse => userId = jsonResponse.id).then(() =>
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, { method: 'POST', headers: headers, body: `{\"name\":\"${name}\"}`})
      .then(response => response.json())
      .then(jsonResponse => {playlistId = jsonResponse.id})).then(() =>
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, { method: 'POST', headers: headers, body: `{"uris":[${uris.map(uri => JSON.stringify(uri))}]}`})
      .then(response => response.json())
      .then(jsonResponse => {playlistId = jsonResponse.id}));
    };
  }
};

export default Spotify;
