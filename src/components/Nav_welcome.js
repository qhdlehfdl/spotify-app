import React from "react";

import "../styles/Nav_welcome.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-section navbar-left">
        {/* 사이트 로고 (원하는 이미지나 텍스트로 교체) */}
        <a href="/">
          <img src="/logo_full.png" alt="Logo" className="navbar-logo" />
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
