import React, { useState, useEffect } from "react";
import "../styles/App.css";
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

  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [isLoadingCountry, setIsLoadingCountry] = useState("Global");

  //초기 글로벌 daily
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/global-data");
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
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch global data or genres:", err);
        setIsLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  const handleCountryClick = async (countryName) => {
    setIsLoading(true); // 로딩 시작
    setIsLoadingCountry(countryName);
    try {
      const response = await fetch(
        `http://localhost:4000/api/countryTop5/${countryName}`
      );
      const data = await response.json();

      if (
        !data.dailyResult?.songs?.length ||
        !data.dailyResult?.artists?.length ||
        !data.weeklyResult?.songs?.length ||
        !data.weeklyResult?.artists?.length
      ) {
        setSelectedCountryData({
          name: countryName,
          topData: null,
          genre: null,
        });
        setIsLoading(false);
        return;
      }

      const dailySongs = data.dailyResult.songs.slice(0, 5);
      const dailyArtists = data.dailyResult.artists.slice(0, 5);
      const weeklySongs = data.weeklyResult.songs.slice(0, 5);
      const weeklyArtists = data.weeklyResult.artists.slice(0, 5);

      fetch("http://localhost:4000/api/get-genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.weeklyResult.artists),
      })
        .then((res) => res.json())
        .then((genreData) => {
          setSelectedCountryData({
            name: countryName,
            topData: {
              daily: { songs: dailySongs, artists: dailyArtists },
              weekly: { songs: weeklySongs, artists: weeklyArtists },
            },
            genre: genreData,
          });
          setIsLoading(false); //  로딩 완료
        })
        .catch((err) => {
          console.error("나라별 Genre 분석 실패:", err);
          setSelectedCountryData({
            name: countryName,
            topData: {
              daily: { songs: dailySongs, artists: dailyArtists },
              weekly: { songs: weeklySongs, artists: weeklyArtists },
            },
            genre: null,
          });
          setIsLoading(false);
        });
    } catch (err) {
      setSelectedCountryData({
        name: countryName,
        topData: null,
        genre: null,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container-fluid px-3 py-2">
        <div className="row gx-4 gy-2">
          <div className="row justify-content-center mb-3">
            <div className="col-12 col-md-4">
              <div className="btn-group">
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {period}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" data-popper-placement="top-end">
                    <li><button className="dropdown-item" onClick={()=> setPeriod("daily")}>daily</button></li>
                    <li><button className="dropdown-item" onClick={()=> setPeriod("weekly")}>weekly</button></li>
                  </ul>
                </div>
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
                    <h5 className="card-title"> Top Songs</h5>
                    {selectedCountryData.topData ? (
                      <TopSongs
                        countryName={selectedCountryData.name}
                        songs={period === "daily"
                          ? selectedCountryData.topData.daily.songs : selectedCountryData.topData.weekly.songs}
                      />
                    ) : (
                      <div>
                        No data in Spotify for {selectedCountryData.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body p-3">
                    <h5 className="card-title"> Top Artists</h5>
                    {selectedCountryData.topData ? (
                      <TopArtists
                        countryName={selectedCountryData.name}
                        artists={period === "daily"
                          ? selectedCountryData.topData.daily.artists
                          : selectedCountryData.topData.weekly.artists}
                      />
                    ) : (
                      <div>
                        No data in Spotify for {selectedCountryData.name}
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
              <div className="card-body p-3 text-center">
                {selectedCountryData.genre ? (
                  <GenrePieChart
                    genres={selectedCountryData.genre}
                    countryName={selectedCountryData.name}
                  />
                ) : (
                  <div>
                    Loading genre chart for {selectedCountryData.name}...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
