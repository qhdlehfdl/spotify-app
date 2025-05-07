export async function searchArtist(query, token) {

    const url = `https://api.spotify.com/v1/search?q=${query}&type=artist&limit=5`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, },
        });

        const data = await response.json();

        const artist = data.artists.items[0];
        
        return artist;
    } catch (error) {
        console.error("searchArtist : ", error);
    }
}