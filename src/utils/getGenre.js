export async function getGenre(globalData, token) {
  let genres = {}; // { genreName: { count: number, artists: [artistObj, ...] } }
  let artistId = [];

  // 순서 유지하며 artistId 리스트 구성
  globalData.forEach((artist) => {
    const artistUri = artist.artistMetadata.artistUri;
    const id = artistUri.split(":")[2];
    artistId.push(id);
  });

  const artistMetaMap = {}; // ID → artistMetadata 연결 (순서 정보 보존)
  globalData.forEach((artist) => {
    const id = artist.artistMetadata.artistUri.split(":")[2];
    artistMetaMap[id] = {
      name: artist.artistMetadata.artistName,
      uri: artist.artistMetadata.artistUri,
      image: artist.artistMetadata.displayImageUri,
    };
  });

  const arrSize = 50;
  for (let i = 0; i < artistId.length; i += arrSize) {
    const arrTemp = artistId.slice(i, i + arrSize);
    const url = `https://api.spotify.com/v1/artists?ids=${arrTemp.join(",")}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error(`Error with chunk starting at ${arrTemp[0]}`);
        continue;
      }

      const data = await response.json();

      data.artists.forEach((artist) => {
        artist.genres.forEach((genre) => {
          if (!genres[genre]) {
            genres[genre] = { count: 0, artists: [] };
          }

          genres[genre].count++;

          // 5명까지만 추가
          if (genres[genre].artists.length < 5) {
            const meta = artistMetaMap[artist.id]; // 순위 정보 포함된 원본 데이터
            genres[genre].artists.push({
              id: artist.id,
              name: meta.name,
              uri: meta.uri,
              image: meta.image,
            });
          }
        });
      });
    } catch (err) {
      console.error("Failed to fetch genre chunk:", err);
    }
  }

  // 상위 7개 장르만 추출 (count 기준)
  const topGenres = Object.entries(genres)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 7)
    .reduce((acc, [genre, data]) => {
      acc[genre] = data;
      return acc;
    }, {});

  return topGenres;
}
