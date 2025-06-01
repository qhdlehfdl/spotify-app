import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import ArtistPage from "./pages/ArtistPage.js";
import HistoryPage from "./pages/HistoryPage.js";
import StreamingPage from "./pages/StreamingPage.js";
import GenrePage from "./pages/GenrePage.js";
import WelcomePage from "./pages/WelcomePage.js";

function App() {
  return (
    <Router>
      {/* 여기에 네비게이션바 */}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/country" element={<HomePage />} />
        <Route path="/artist" element={<ArtistPage />} />
        <Route path="/artist/:artistName" element={<ArtistPage />} />
        <Route path="/history" element={<HistoryPage/>}/>
        <Route path="/streaming" element={<StreamingPage />} />
        <Route path="/genre" element={<GenrePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
