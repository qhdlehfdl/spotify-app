export async function getArtistTopTracks(artistId, token) {
    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks`;

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

        const tracks = data.tracks;
        console.log(tracks);

        return tracks;
    } catch (error) {
        console.error("get related artist error", error);
    }
}