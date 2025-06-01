import React, { useState, useEffect } from "react";
import Globe from "../components/Globe.js";
import TopArtists from "../components/TopArtists.js";
import GenrePieChart from "../components/genrePieChart.js";
import { getDailyGlobalData } from "../utils/getDailyGlobalData.js";
import "../styles/GenrePage.css";

function GenrePage() {
  const [globalData, setGlobalData] = useState({
    name: "Global",
    artists: null,
    genre: null
  });
  const [selectedCountryData, setSelectedCountryData] = useState({
    name: null,
    artists: null,
    genre: null
  });
  const [selectedGlobalGenreArtists, setSelectedGlobalGenreArtists] = useState(null);
  const [selectedCountrylGenreArtists, setSelectedCountryGenreArtists] = useState(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [countryError, setCountryError] = useState(null);

  useEffect(() => {
    const fetchGlobalData = async () => {
      setIsGlobalLoading(true);
      try {
        const response = await fetch(
          "http://localhost:4000/api/genre-data?country=global"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch global data");
        }
        const data = await response.json();
        console.log(data);

        setGlobalData({ name: "Global", artists: data.artists, genre: data.genre });

      } catch (err) {
        console.error("Failed to fetch global data or genres:", err);
        setGlobalError(err.message);
      } finally {
        setIsGlobalLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  const handleCountryClick = async (countryName) => {
    setIsCountryLoading(true);
    setCountryError(null);
    try {
      const response = await fetch(`http://localhost:4000/api/genre-data?country=${countryName}`);
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error("Chart data not available for this country");
      }

      setSelectedCountryData({ name: countryName, artists: data.artists, genre: data.genre });
    } catch (err) {
      console.error(err);
      setCountryError(err.message);
    } finally {
      setIsCountryLoading(false);
    }
  };

  const handleGlobalGenreClick = (genreName) => {
    const genreData = globalData.genre?.[genreName];
    if (genreData && genreData.artists) {
      setSelectedGlobalGenreArtists({
        genre: genreName,
        artists: genreData.artists.slice(0, 5).map((artist) => ({
          artistMetadata: {
            artistName: artist.name,
            displayImageUri: artist.image,
          },
        })),
      });
      
    }
  };

  const handleCountryGenreClick = (genreName) => {
    const genreData = selectedCountryData.genre?.[genreName];
    if (genreData && genreData.artists) {
      setSelectedCountryGenreArtists({
        genre: genreName,
        artists: genreData.artists.slice(0, 5).map((artist) => ({
          artistMetadata: {
            artistName: artist.name,
            displayImageUri: artist.image,
          },
        })),
      });
    }
  };
  

  return (
    <div className="app">
      <div className="container-fluid px-3 py-2">
        <div className="row gx-4 gy-2">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body p-3">
                <Globe onCountryClick={handleCountryClick} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="row h-100 gx-2">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body p-3">
                    {selectedGlobalGenreArtists?.genre && (
                      <TopArtists
                        countryName={selectedGlobalGenreArtists.genre}
                        artists={selectedGlobalGenreArtists.artists}
                        onGenreClick={handleGlobalGenreClick}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body p-3">
                    {selectedCountrylGenreArtists?.genre && (
                      <TopArtists
                        countryName={selectedCountrylGenreArtists.genre}
                        artists={selectedCountrylGenreArtists.artists}
                      />
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
                  <div className="col-md-6 text-center">
                    {isGlobalLoading ? (
                      <div className="error-message">Loading pie chart...</div>
                    ) : globalError ? (
                      <div className="text-danger">No data in spotify</div>
                    ) : globalData.genre ? (
                      <GenrePieChart
                        countryName={globalData.name}
                        genres={globalData.genre}
                        onGenreClick={handleGlobalGenreClick}
                      />
                    ) : (
                      <div>No data</div>
                    )}
                  </div>

                  <div className="col-md-6 text-center">
                    {isCountryLoading ? (
                      <div className="error-message">Loading pie chart...</div>
                    ) : countryError ? (
                      <div className="text-danger">No data in spotify</div>
                    ) : selectedCountryData.genre ? (
                      <GenrePieChart
                        countryName={selectedCountryData.name}
                        genres={selectedCountryData.genre}
                        onGenreClick={handleCountryGenreClick}
                      />
                    ) : (
                      <div>No data</div>
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

export default GenrePage;
