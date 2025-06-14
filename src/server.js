import express from "express";
import cors from "cors";
import { getGenre } from "./utils/getGenre.js";
import {
  getCountryTopArtists,
  getCountryTopSongs,
} from "./utils/getCountryTopSongsAndArtists.js";
import { getWeeklyGlobalData } from "./utils/getGlobalTop5.js";
import { searchArtist } from "./utils/searchArtist.js";
import { getSpotifyToken } from "./utils/getSpotifyToken.js";
import { getRelatedArtists } from "./utils/getRelatedArtists.js";
import { getArtistTopTracks } from "./utils/getArtistTopTracks.js";
import { getDailyGlobalData } from "./utils/getDailyGlobalData.js";
import { getStreamingData } from "./utils/getStreamingData.js";
import { getCollaborateArtists } from "./utils/getCollaborateArtists.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;

const unofficialToken =
  "Bearer BQAiHGzqNHiL1XVi2W1JdKcO9u318Ff2uBhrFgDonOt1EpeL6zZ8JVwhypFj9007cLWSbUAEpY0rkC3Q-RFHkQfQpFOjMnWCXMkFijlv91rJJBzXO1GJvP2shlYZ5KcArh4Ul0qw-8gwbdyIvCowhSyMwlHn9IwEzAtx7Y-DeAYQPUOEFI525N0XiFtVXzzT1Zeh4GQn1eOmMKlSnNnRKE32eZ_P6x_ZQ9jfLjCRCDUw7yogYYhJCYHwu-bSREzv";

app.get("/api/countryTop5/:country", async (req, res) => {
  const countryName = req.params.country;
  const songs = await getCountryTopSongs(unofficialToken, countryName, "latest");
  const artists = await getCountryTopArtists(unofficialToken, countryName);
  const dailyResult = await getDailyGlobalData(unofficialToken, countryName,"latest");

  const result = { weeklyResult:{songs,artists},dailyResult };
  res.json(result);
});

app.get("/api/global-data", async (req, res) => {
  const weeklyResult = await getWeeklyGlobalData();
  const dailyResult = await getDailyGlobalData(unofficialToken, "global", "latest");
  
  const result = { weeklyResult, dailyResult };

  res.json(result);
});

app.post("/api/get-genre", async (req, res) => {
  const globalData = req.body;
  const token = await getSpotifyToken();

  const result = await getGenre(globalData, token);
  res.json(result);
});

app.get("/api/search-artist/:query", async (req, res) => {
  const query = req.params.query;

  const token = await getSpotifyToken();
  const artist = await searchArtist(query, token);
  const relatedArtist = await getRelatedArtists(artist.genres[0], token);
  const tracks = await getArtistTopTracks(artist.id, token);
  const collaborateArtists = await getCollaborateArtists(artist.id, token);

  res.json({ artist, relatedArtist: relatedArtist, tracks: tracks, collaborate:collaborateArtists });
});

app.get("/api/history-data", async (req, res) => {
  const country = req.query.country;
  const date = req.query.date;

  const result = await getDailyGlobalData(unofficialToken, country, date);

  res.json(result);
});

app.get("/api/streaming-data", async (req, res) => {
  const country = req.query.country;
  
  const result = await getStreamingData(unofficialToken, country);
  console.log(country);
  res.json(result);
})

app.get("/api/genre-data", async (req, res) => {
  const countryName = req.query.country;
  const dailyResult = await getDailyGlobalData(unofficialToken, countryName, "latest");
  const token = await getSpotifyToken();
  const genre = await getGenre(dailyResult.artists, token);

  const result = { artists: dailyResult.artists, songs: dailyResult.songs, genre: genre };
  res.json(result);
});

app.get("/api/selected-country", async (req, res) => {
  const countryName = req.query.country;

  const dailyResult = await getDailyGlobalData(unofficialToken, countryName, "latest");

  res.json(dailyResult);
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
