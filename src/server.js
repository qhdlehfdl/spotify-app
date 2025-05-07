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

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;

const unofficialToken =
  "Bearer BQAH-sKzZwK3G22qaQ1c9cSyYSSpcokjbVhxVkFHafz--MBEVslLObmLoA0xXzoh4Vw5KHS1MAH6URsVQKj3p4wNCbS8gBFLBLfqVhFQIQMpxZ3E8GYHtoQdcDjZoT4tqemsiFZj4ar5NiezpbDJ3091Xi_pm55wy6TWVLn53LQMfwqMx6hA6KFZzBJyIsHZx6y6v2ZK55FA3Zwvro7VKTpj1zMLxqmnNLLn0M0opqAhxbBKku4pvA2l1hwBsS5W";

app.get("/api/countryTop5/:country", async (req, res) => {
  const countryName = req.params.country;
  const songs = await getCountryTopSongs(unofficialToken, countryName);
  const artists = await getCountryTopArtists(unofficialToken, countryName);
  const dailyResult = await getDailyGlobalData(unofficialToken, countryName);

  const result = { weeklyResult:{songs,artists},dailyResult };
  res.json(result);
});

app.get("/api/global-data", async (req, res) => {
  const weeklyResult = await getWeeklyGlobalData();
  const dailyResult = await getDailyGlobalData(unofficialToken, "global");
  
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

  res.json({ artist, relatedArtist: relatedArtist, tracks: tracks });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
