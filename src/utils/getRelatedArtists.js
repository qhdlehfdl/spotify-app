export async function getRelatedArtists(query, token) {
    const url = `https://api.spotify.com/v1/search?q=genre:${query}&type=artist&limit=10`;
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, },
        });

        if (!response.ok) {
          const text = await response.text(); // 오류 디버깅용
          console.error(`Error: ${response.status}`, text);
          throw new Error(
            `Failed to fetch related artists: ${response.status}`
          );
        }

        const data = await response.json();

        const relatedArtists = data.artists;

        return relatedArtists;
    } catch (error) {
        console.error("get related artist error", error);
    }
}