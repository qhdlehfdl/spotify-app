import {getCountryTopSongs} from "./getCountryTopSongsAndArtists.js";

export async function getStreamingData(token, country) {
  const startDate = new Date("2025-01-09");
  const today = new Date();
  const thursdays = [];
    

  // 매주 목요일 날짜 리스트 생성
  while (startDate <= today) {
    const yyyy = startDate.getFullYear();
    const mm = String(startDate.getMonth() + 1).padStart(2, "0");
    const dd = String(startDate.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    thursdays.push(dateStr);

    //다음 주 목요일로
    startDate.setDate(startDate.getDate() + 7);
  }

  let results = { artists: {}, tracks: {} };

  for (const date of thursdays) {
    try {
      const result = await getCountryTopSongs(token, country, date);
      if (!result || result.length === 0) {
        console.warn(`No data returned for ${date}`);
        continue;
      }

      for (const element of result) {
        const songName = element.trackMetadata.trackName;
        const streamingValue = Number(
          element.chartEntryData.rankingMetric.value
        );
        const imageURL = element.trackMetadata.displayImageUri;
        const dateEntry = { date: date, streaming: streamingValue };

        if (!results.tracks[songName]) {
          results.tracks[songName] = {
            imageURL: imageURL,
            totalStreaming: 0,
            artists: [],
            dates: [],
          };
        }
        results.tracks[songName].dates.push(dateEntry);
        results.tracks[songName].totalStreaming += streamingValue;

        element.trackMetadata.artists.forEach((artist) => {
          const artistName = artist.name;

          //아티스트 없으면 초기화
          if (!results.artists[artistName]) {
            results.artists[artistName] = {
              artistName: artistName,
              totalStreaming: 0,
              songs: {},
            };
          }
          results.artists[artistName].totalStreaming += streamingValue;

          // 노래가 없으면 초기화
          if (!results.artists[artistName].songs[songName]) {
            results.artists[artistName].songs[songName] = {
              imageURL: imageURL,
              songName: songName,
              streaming: 0,
            };
          }
          results.artists[artistName].songs[songName].streaming +=
            streamingValue;

          if (!results.tracks[songName].artists.includes(artistName)) {
            results.tracks[songName].artists.push(artistName);
          }
        });
      }
    } catch (err) {
      console.error(`Error fetching for ${date}:`, err);
    }
  }

  //totalStreaming 내림차순 정렬
  const sortedArtists = Object.values(results.artists).sort(
    (a, b) => b.totalStreaming - a.totalStreaming
  );

  const sortedTracks = Object.entries(results.tracks)
    .sort((a, b) => b[1].totalStreaming - a[1].totalStreaming)
    .map(([songName, trackData]) => ({ songName, ...trackData }));

  return {
    artists: sortedArtists,
    tracks: sortedTracks,
  };
}