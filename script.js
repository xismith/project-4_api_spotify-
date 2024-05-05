const clientId = '8380f8a9ed6942c1a5cb5ef1902a9c6d';
const clientSecret = '30ee8fab03cc47458af96e33ed1021dc';

async function getTopTracks() {
    const artistName = document.getElementById('artist').value;
    const token = await getAccessToken();

    if (token) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=1`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const artistId = data.artists.items[0].id;

        const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const topTracksData = await topTracksResponse.json();
        displayTracks(topTracksData.tracks);
    }
}

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

function displayTracks(tracks) {
    const tracksDiv = document.getElementById('tracks');
    tracksDiv.innerHTML = '';

    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.innerHTML = `
            <div>
                <img src="${track.album.images[0].url}" alt="${track.name}">
                <p>${track.name}</p>
            </div>
        `;
        tracksDiv.appendChild(trackElement);
    });
}