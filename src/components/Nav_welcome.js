import React from "react";

import "../styles/Nav_welcome.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-section navbar-left">
        {/* 사이트 로고 (풀사이즈) */}
        <img src="/logo_full.png" alt="Logo" className="navbar-logo" />
      </div>
    </nav>
  );
}

export default Navbar;
