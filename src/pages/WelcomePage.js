import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/WelcomePage.css";

function WelcomePage() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      navigate(`/artist/${input.trim()}`);
    }
  };
  
  return (
    <div className="app">
      {/* 백그라운드 지구본 사진 (추후 영상으로 대체하거나, 그대로 사용) */}
      <img className="welcome-bg" src="/bg.png" alt="" />

      {/* 중앙 환영글 */}
      <div className="welcome-center">
        <h1 className="welcome-center-title">Explore the most popular songs.</h1>
        <p className="welcome-center-desc">
          Explore the most popular Spotify charts by country.<br />
          Dive into analytics and discover music trends worldwide!
        </p>

        {/* 가수 검색 (검색 시 아티스트 페이지로 넘어감) */}
        <form onSubmit={onSearch}>
          <div className="welcome-searchbar">
            <input
              className="search-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search for an artist"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </div>
        </form>
        

        {/* 페이지 이동 링크 */}
        <div className="welcome-links">
          <button className="spotify-button" onClick={() => window.open('https://spotify.com', '_blank')}>
            <img src="/Spotify_logo_with_text.svg" alt="Spotify"/>
          </button>
          <a class="page-link" href="/country">🌏Global</a>
          <a class="page-link" href="/artist">🎵Artist</a>
          <a class="page-link" href="/history">📅History</a>
          <a class="page-link" href="/streaming">🎧Streaming</a>

        </div>
      </div>

      {/* footer 부분 (제거해도 무방) */}
      <footer className="welcome-footer">
        <div>
          <span>© 2025 Team Doraemon | </span>
          <a href="https://github.com/qhdlehfdl/spotify-app" target="_blank">GitHub</a> |
          <a href="#about">About</a>
        </div>
        <div>
          <small>This site is not the official site of Spotify.</small>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
