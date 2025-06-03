// src/pages/HistoryPage.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";

import Globe from "../components/Globe.js";
import TopSongs from "../components/TopSongs.js";
import TopArtists from "../components/TopArtists.js";
import Navbar from "../components/Nav.js";

import "../styles/HistoryPage.css";


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

    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleCountryClick = (countryName) => {
    setSelectedCountry(countryName);
  };

  return (
    <div className="history-page">
      <img className="welcome-bg" src="/bg.png" alt="" />
      <Navbar />

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
          {/* TopSongs 카드 */}
          <AnimatePresence mode="wait">
            {!isLoading && chartData && !error ? (
              <motion.div
                key={`songs-${selectedCountry}-${selectedDate.toISOString()}`}
                className="chart-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div
                  className="card"
                  style={{ backgroundColor: "rgba(17, 59, 87, 0.329)" }}
                >
                  <TopSongs
                    countryName={selectedCountry}
                    songs={chartData.songs}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`empty-songs-${selectedCountry}-${selectedDate.toISOString()}`}
                className="chart-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card">
                  {isLoading ? (
                    <div className="loading-message">Loading chart data...</div>
                  ) : error ? (
                    <div className="error-message">
                      Spotify doesn't provide chart data for {selectedCountry}
                    </div>
                  ) : (
                    <div className="error-message">
                      No chart data available for {selectedCountry}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TopArtists 카드 */}
          <AnimatePresence mode="wait">
            {!isLoading && chartData && !error ? (
              <motion.div
                key={`songs-${selectedCountry}-${selectedDate.toISOString()}`}
                className="chart-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="card" style={{ backgroundColor: "rgba(17, 59, 87, 0.329)" }}>
                  <TopArtists
                    countryName={selectedCountry}
                    artists={chartData.artists}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`empty-artists-${selectedCountry}-${selectedDate.toISOString()}`}
                className="chart-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card">
                  {isLoading ? (
                    <div className="loading-message">Loading chart data...</div>
                  ) : error ? (
                    <div className="error-message">
                      Spotify doesn't provide chart data for {selectedCountry}
                    </div>
                  ) : (
                    <div className="error-message">
                      No chart data available for {selectedCountry}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;