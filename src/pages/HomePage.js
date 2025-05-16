import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import Globe from "../components/Globe.js";
import TopSongs from "../components/TopSongs.js";
import TopArtists from "../components/TopArtists.js";
import GenrePieChart from "../components/genrePieChart.js";

function HomePage() {
  const [globalData, setGlobalData] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState({
    name: "Global",
    topData: null,
    genre: null,
  });
  const [period, setPeriod] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalGenre, setGlobalGenre] = useState(null);

  // 초기 글로벌 daily
  useEffect(() => {
    const fetchGlobalData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:4000/api/global-data");
        if (!response.ok) {
          throw new Error("Failed to fetch global data");
        }
        const data = await response.json();

        const dailySongs = data.dailyResult.songs.slice(0, 5);
        const dailyArtists = data.dailyResult.artists.slice(0, 5);
        const weeklySongs = data.weeklyResult.songs.slice(0, 5);
        const weeklyArtists = data.weeklyResult.artists.slice(0, 5);

        const genreResponse = await fetch(
          "http://localhost:4000/api/get-genre",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.weeklyResult.artists),
          }
        );
        if (!genreResponse.ok) {
          throw new Error("Failed to fetch genre data");
        }
        const genreData = await genreResponse.json();

        setSelectedCountryData({
          name: "Global",
          topData: {
            daily: { songs: dailySongs, artists: dailyArtists },
            weekly: { songs: weeklySongs, artists: weeklyArtists },
          },
          genre: genreData,
        });

        setGlobalData(data);
        setGlobalGenre(genreData);
      } catch (err) {
        setError("Failed to load global data. Please try again.");
        console.error("Failed to fetch global data or genres:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  const handleCountryClick = async (countryName) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:4000/api/countryTop5/${countryName}`
      );
      if (!response.ok) {
        throw new Error("Chart data not available for this country");
      }
      const data = await response.json();

      if (
        !data.dailyResult?.songs?.length ||
        !data.dailyResult?.artists?.length ||
        !data.weeklyResult?.songs?.length ||
        !data.weeklyResult?.artists?.length
      ) {
        throw new Error("No chart data available for this country");
      }

      const dailySongs = data.dailyResult.songs.slice(0, 5);
      const dailyArtists = data.dailyResult.artists.slice(0, 5);
      const weeklySongs = data.weeklyResult.songs.slice(0, 5);
      const weeklyArtists = data.weeklyResult.artists.slice(0, 5);

      const genreResponse = await fetch("http://localhost:4000/api/get-genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.weeklyResult.artists),
      });
      const genreData = await genreResponse.json();

      setSelectedCountryData({
        name: countryName,
        topData: {
          daily: { songs: dailySongs, artists: dailyArtists },
          weekly: { songs: weeklySongs, artists: weeklyArtists },
        },
        genre: genreData,
      });
    } catch (err) {
      setError(`Spotify doesn't provide chart data for ${countryName}`);
      setSelectedCountryData({
        name: countryName,
        topData: null,
        genre: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBacktoGlobalBtn = () =>
    setSelectedCountryData({
      name: "Global",
      topData: {
        daily: {
          songs: globalData.dailyResult.songs.slice(0, 5),
          artists: globalData.dailyResult.artists.slice(0, 5),
        },
        weekly: {
          songs: globalData.weeklyResult.songs.slice(0, 5),
          artists: globalData.weeklyResult.artists.slice(0, 5),
        },
      },
      genre: globalGenre,
    });

  return (
    <div className="app">
      <div className="container-fluid px-3 py-2">
        <div className="row gx-4 gy-2">
          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-4">
              <div className="btn-group">
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {period}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    data-popper-placement="top-end"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setPeriod("daily")}
                      >
                        daily
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setPeriod("weekly")}
                      >
                        weekly
                      </button>
                    </li>
                  </ul>
                </div>

                {selectedCountryData.name !== "Global" &&
                  globalData &&
                  globalGenre && (
                    <button
                      className="btn btn-secondary"
                    onClick={handleBacktoGlobalBtn}
                    >
                      Back to Global
                    </button>
                  )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body p-3">
                <Globe
                  onCountryClick={handleCountryClick}
                  selectedCountry={selectedCountryData.name}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row h-100 gx-2">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body p-3">
                    {isLoading ? (
                      <div className="loading-message">
                        Loading chart data ...
                      </div>
                    ) : error ? (
                      <div className="error-message">{error}</div>
                    ) : selectedCountryData.topData ? (
                      <TopSongs
                        countryName={selectedCountryData.name}
                        songs={
                          period === "daily"
                            ? selectedCountryData.topData.daily.songs
                            : selectedCountryData.topData.weekly.songs
                        }
                      />
                    ) : (
                      <div className="error-message">
                        No chart data available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body p-3">
                    {isLoading ? (
                      <div className="loading-message">
                        Loading chart data ...
                      </div>
                    ) : error ? (
                      <div className="error-message">{error}</div>
                    ) : selectedCountryData.topData ? (
                      <TopArtists
                        countryName={selectedCountryData.name}
                        artists={
                          period === "daily"
                            ? selectedCountryData.topData.daily.artists
                            : selectedCountryData.topData.weekly.artists
                        }
                      />
                    ) : (
                      <div className="error-message">
                        No chart data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-2 gy-2 mt-2">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  {/* 왼쪽: 선택된 국가의 장르 */}
                  <div className="col-md-6 text-center">
                    {isLoading ? (
                      <div className="loading-message">
                        Loading genre chart...
                      </div>
                    ) : error ? (
                      <div className="error-message">{error}</div>
                    ) : selectedCountryData.name !== "Global" &&
                      selectedCountryData.genre ? (
                      <GenrePieChart
                        genres={selectedCountryData.genre}
                        countryName={selectedCountryData.name}
                      />
                    ) : (
                      <div className="error-message">
                        No genre data available
                      </div>
                    )}
                  </div>

                  {/* 오른쪽: 글로벌 장르 */}
                  <div className="col-md-6 text-center">
                    {globalGenre ? (
                      <GenrePieChart
                        genres={globalGenre}
                        countryName="Global"
                      />
                    ) : (
                      <div className="loading-message">
                        Loading global genre chart...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
