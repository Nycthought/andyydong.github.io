const CLIENT_ID = 'f11b1c731c3c43d7abe27033f57a17b3'; 
const REDIRECT_URI = window.location.origin + window.location.pathname; 
const AUTH_ENDPOINT = "https://spotify.com";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-private user-read-email";

const loginBtn = document.getElementById('login-btn');
const profileDataDiv = document.getElementById('profile-data');

// 1. Redirect user to Spotify authorization page on click
loginBtn.addEventListener('click', () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
});

// 2. Check URL for returned Access Token after redirect
function getAccessTokenFromUrl() {
    const hash = window.location.hash;
    if (!hash) return null;
    
    const params = new URLSearchParams(hash.substring(1));
    return params.get('access_token');
}

// 3. Fetch data from Spotify Web API
async function fetchSpotifyProfile(token) {
    const response = await fetch('https://spotify.com', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Execution logic on load
window.addEventListener('DOMContentLoaded', async () => {
    const token = getAccessTokenFromUrl();
    if (token) {
        // Clear token from URL address bar for security
        window.location.hash = '';
        loginBtn.style.display = 'none';
        
        try {
            const data = await fetchSpotifyProfile(token);
            profileDataDiv.innerHTML = `
                <h3>Logged in as: ${data.display_name}</h3>
                <p>Followers: ${data.followers.total}</p>
                <img src="${data.images[0]?.url}" width="150" alt="Profile pic">
            `;
        } catch (err) {
            profileDataDiv.innerText = "Error loading profile data.";
        }
    }
});
