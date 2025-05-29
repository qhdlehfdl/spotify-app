import React from 'react';
import "../styles/WelcomePage.css";

function WelcomePage() {
  return (
    <div className="App">
      {/* 백그라운드 지구본 사진 (추후 영상으로 대체) */}
      <img className="bga" src="/bg.png" />

      {/* 중앙 환영글 */}
      <div className="center-panel">
        <h1 className="main-title">Explore the most popular songs.</h1>
        <p className="main-desc">
          Explore the most popular Spotify charts by country.<br />
          Dive into analytics and discover music trends worldwide!
        </p>
        {/* 가수 검색 */}
        <input
          type="text"
          className="search-input"
          placeholder="Search for an artist..."
        />
        {/* 주요 페이지 이동 버튼 */}
        <div className="btn-group">
          <button className="main-btn">Country Charts</button>
          <button className="main-btn">Statistics</button>
          <button className="main-btn">About</button>
        </div>
      </div>

      {/* footer 부분 (제거해도 무방) */}
      <footer className="welcome-footer">
        <div>
          <span>© 2025 Doraemon Team | </span>
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
