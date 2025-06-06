import React from "react";

import "../styles/Nav.css";

function Navbar() {
  return (
    <nav className="main-navbar">
      <div className="navbar-section navbar-left">
        {/* 사이트 로고 (원하는 이미지나 텍스트로 교체) */}
        <a href="/">
          <img src="/logo_full.png" alt="Logo" className="navbar-logo" />
        </a>
      </div>
      <div className="navbar-section navbar-center">
        
        <a href="/genre" className="nav-menu">
          Genre
        </a>
        <a href="/artist" className="nav-menu">
          Artist
        </a>
        <a href="/history" className="nav-menu">
          History
        </a>
        <a href="/streaming" className="nav-menu">
          Streaming
        </a>
      </div>
      <div className="navbar-section navbar-right">
        <a
          href="https://www.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-btn"
        >
          Spotify
        </a>
      </div>
    </nav>
  );
}

export default Navbar;