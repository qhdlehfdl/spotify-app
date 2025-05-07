export async function getGenre(globalData, token) {
  let genres = {};
  let artistId = [];

  globalData.map((artist) => {
    //아티스트 id 추출출
    const artistUri = artist.artistMetadata.artistUri;
    const id = artistUri.split(":")[2];

    artistId.push(id);
  });

  //50개씩 잘라서 요청청
  const arrSize = 50;
  for (let i = 0; i < artistId.length; i += arrSize) {
    const arrTemp = artistId.slice(i, i + arrSize);
    const url = `https://api.spotify.com/v1/artists?ids=${arrTemp.join(",")}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error(`error chunk starting with ${arrTemp[0]}`);
        continue;
      }

      const data = await response.json();

      data.artists.forEach((artist) => {
        artist.genres.forEach((genre) => {
          if (genres[genre]) genres[genre]++;
          else genres[genre] = 1;
        });
      });
    } catch (err) {
      console.error("Failed to fetch genre chunk:", err);
    }
  }

  // 상위 7개 장르만 추출
  const topGenres = Object.entries(genres)
    .sort((a, b) => b[1] - a[1]) // count 기준 내림차순
    .slice(0, 7) // 상위 7개만
    .reduce((acc, [genre, count]) => {
      acc[genre] = count;
      return acc;
    }, {});

  return topGenres;
}