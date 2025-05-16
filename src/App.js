import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import ArtistPage from "./pages/ArtistPage.js";
import HistoryPage from "./pages/HistoryPage.js";
import StreamingPage from "./pages/StreamingPage.js";

function App() {
  return (
    <Router>
      {/* 여기에 네비게이션바 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/artist" element={<ArtistPage />} />
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/Streaming" element={<StreamingPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
