import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Globe from "../components/Globe.js";
import "../styles/HistoryPage.css";
import TopSongs from "../components/TopSongs.js";
import TopArtists from "../components/TopArtists.js";

function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("global");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const fetchChartData = async () => {
    setIsLoading(true);
    setError(null);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const today = new Date();
    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    const dateParam = isToday ? "latest" : formattedDate;

    try {
      const response = await fetch(
        `http://localhost:4000/api/history-data?country=${selectedCountry}&date=${dateParam}`
      );

      if (!response.ok) {
        throw new Error("Chart data not available for this country");
      }

      const data = await response.json();
      setChartData(data);
    } catch (error) {
      setError(error.message);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [selectedDate, selectedCountry]);

  const handleDateChange = (value) => {
    const newDate = new Date(value);
    const date = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
  };

  return (
    <div className="history-page">
      <div className="calendar-header">
        <button
          onClick={toggleCalendar}
          className="calendar-toggle-btn btn btn-light"
        >
          {selectedDate
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\. /g, "-")
            .replace(/\./, "")}
        </button>
        {showCalendar && (
          <div className="calendar-wrapper">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              locale="en-US"
              minDate={new Date(2021, 9, 21)}
              maxDate={new Date()}
            />
          </div>
        )}
      </div>

      <div className="main-content">
        <div className="globe-container">
          <Globe 
            onCountryClick={handleCountryClick}
            selectedCountry={selectedCountry}
          />
        </div>

        <div className="chart-container">
          <div className="chart-card">
            <div className="card">
              {isLoading ? (
                <div className="loading-message">Loading chart data...</div>
              ) : error ? (
                <div className="error-message">
                  Spotify doesn't provide chart data for {selectedCountry}
                </div>
              ) : chartData ? (
                <TopSongs
                  countryName={selectedCountry}
                  songs={chartData.songs}
                />
              ) : (
                <div className="error-message">
                  No chart data available for {selectedCountry}
                </div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="card">
              {isLoading ? (
                <div className="loading-message">Loading chart data...</div>
              ) : error ? (
                <div className="error-message">
                  Spotify doesn't provide chart data for {selectedCountry}
                </div>
              ) : chartData ? (
                    <TopArtists
                  countryName={selectedCountry}
                  artists={chartData.artists}
                />
              ) : (
                <div className="error-message">
                  No chart data available for {selectedCountry}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
