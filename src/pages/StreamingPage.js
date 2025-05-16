import React, { useState, useEffect } from "react";
import Globe from "../components/Globe.js";
import ArtistBarChart from "../components/ArtistBarChart.js";
import SongBarChart from "../components/SongBarChart.js";
import StreamingLineChart from "../components/StreamingLineChart.js";
import "../styles/StreamingPage.css";

function StreamingPage() {
  const [selectedCountry, setSelectedCountry] = useState("global");
  const [streamingData, setStreamingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistBarChartData, setArtistBarChartData] = useState(null);
  const [songBarChartData, setSongBarChartData] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [streamingChartData, setStreamingChartData] = useState(null);
  const [noDataForCountry, setNoDataForCountry] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setSelectedArtist(null);
    setSelectedSong(null);
    setSongBarChartData(null);
    setStreamingChartData(null);
    setNoDataForCountry(false);

    try {
      const response = await fetch(
        `http://localhost:4000/api/streaming-data?country=${selectedCountry}`
      );
      if (!response.ok) {
        throw new Error("차트 데이터를 불러올 수 없습니다.");
      }
      const data = await response.json();

      if (!data.artists || data.artists.length === 0) {
        setStreamingData(null);
        setArtistBarChartData(null);
        setNoDataForCountry(true);
        return;
      }

      const temp = data.artists.map((artist) => ({
        artistName: artist.artistName,
        streams: Number(artist.totalStreaming),
      }));
      console.log(data);
      setStreamingData(data);
      setArtistBarChartData(temp);
    } catch (error) {
      setNoDataForCountry(true);
      setStreamingData(null);
      setArtistBarChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
  };

  const handleArtistClick = (artistData) => {
    setSelectedArtist(artistData);

    if (streamingData && streamingData.artists) {
      const artistObj = streamingData.artists.find(
        (artist) => artist.artistName === artistData.artistName
      );

      if (artistObj && artistObj.songs) {
        const temp = Object.values(artistObj.songs)
          .map((song) => ({
            songName: song.songName,
            imageURL: song.imageURL,
            streaming: Number(song.streaming),
          }))
          .sort((a, b) => b.streaming - a.streaming);

        setSongBarChartData(temp);
      }
    }
  };

  const handleSongClick = (songData) => {
    setSelectedSong(songData);

    if (streamingData && streamingData.tracks) {
      const trackObj = streamingData.tracks.find(
        (track) => track.songName === songData.songName
      );

      if (trackObj && trackObj.dates) {
        const temp = trackObj.dates
          .map((item) => ({
            date: item.date,
            streaming: item.streaming,
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setStreamingChartData(temp);
      }
    }
  };

  return (
    <div className="streaming-page">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <div className="loading-text">Loading streaming data...</div>
        </div>
      )}
      <div className="grid-container">
        <div className="grid-item globe-cell">
          <h3>Choose Country</h3>
          <div className="globe-wrapper">
            <Globe
              onCountryClick={handleCountryClick}
              selectedCountry={selectedCountry}
              width="100%"
              height="100%"
            />
          </div>
        </div>

        <div className="grid-item artist-chart-cell">
          <h3>{selectedCountry} Top Artist</h3>
          {noDataForCountry ? (
            <p className="error-message">
              Spotify doesn't provide data for {selectedCountry}
            </p>
          ) : artistBarChartData ? (
            <ArtistBarChart
              artists={artistBarChartData}
              onArtistClick={handleArtistClick}
            />
          ) : null}
        </div>

        <div className="grid-item song-chart-cell">
          <h3>{selectedArtist?.artistName || "Artist"}'s Popular Tracks</h3>
          {songBarChartData ? (
            <div className="song-chart-scroll">
              <SongBarChart
                songs={songBarChartData}
                onSongClick={handleSongClick}
              />
            </div>
          ) : selectedArtist ? (
            <p>Select an artist to view tracks.</p>
          ) : null}
        </div>

        <div className="grid-item trend-chart-cell">
          <h3>Weekly Streaming</h3>
          {streamingChartData ? (
            <StreamingLineChart data={streamingChartData} />
          ) : selectedSong ? (
            <p>Select a song to view streaming trend.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StreamingPage;
