import axios from "axios";

const url = "https://charts-spotify-com-service.spotify.com/public/v0/charts";

const headers = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://charts.spotify.com",
  Referer: "https://charts.spotify.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
};

export async function getWeeklyGlobalData() {
  try {
    const res = await axios.get(url, { headers });
    const songs = res.data.chartEntryViewResponses[0].entries;
    const artists = res.data.chartEntryViewResponses[2].entries;

    return {
      songs: songs,
      artists: artists,
    };
  } catch (err) {
    console.error("📛 오류 발생:", err.message);
  }
}

getWeeklyGlobalData();
