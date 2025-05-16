import {countryNameToCode} from "./getCountryTopSongsAndArtists.js";

export async function getDailyGlobalData(token, region, period) {
  if (region !== "global") {
    region = await countryNameToCode(region);
  }
 
  console.log(region, period);

    const songUrl = `https://charts-spotify-com-service.spotify.com/auth/v0/charts/regional-${region}-daily/${period}`;
    const artistUrl = `https://charts-spotify-com-service.spotify.com/auth/v0/charts/artist-${region}-daily/${period}`;
    
  try {
    const headers = {
      Authorization: token,
      Accept: "application/json",
      "Content-Type": "application/json",
      "app-platform": "Browser",
      "spotify-app-version": "0.0.0.production",
      Origin: "https://charts.spotify.com",
      Referer: "https://charts.spotify.com/",
    };
    const songResponse = await fetch(songUrl, { method: "GET", headers });
    if (!songResponse.ok) 
      throw new Error(`HTTP error! status: ${songResponse.status}`);
    const songResult = await songResponse.json();

    const artistResponse = await fetch(artistUrl, { method: "GET", headers });
    if (!artistResponse.ok)
      throw new Error(`HTTP error! status: ${artistResponse.status}`);
    const artistResult = await artistResponse.json();

    const result = {
      songs: songResult.entries,
      artists : artistResult.entries
    }

    return result;
  } catch (error) {
    console.error("Error fetching Spotify chart:", error);
  }
}