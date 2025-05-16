export async function getCollaborateArtists(id, token) {
    const url = `https://api.spotify.com/v1/artists/${id}/albums?limit=50`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("searchArtist : ", error);
    }
}
