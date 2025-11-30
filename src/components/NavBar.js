// src/components/Navbar.js
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-header-row">
          <NavLink to="/" className="nav-brand" onClick={closeMenu}>
            台灣猛健樂資訊網
          </NavLink>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
          >
            <span className={`nav-toggle-bar ${isMenuOpen ? "open" : ""}`} />
            <span className={`nav-toggle-bar ${isMenuOpen ? "open" : ""}`} />
            <span className={`nav-toggle-bar ${isMenuOpen ? "open" : ""}`} />
          </button>
        </div>

        {/* Main links */}
        <div className={`nav-main ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className="nav-item" onClick={closeMenu}>
                價格資訊
              </NavLink>
            </li>
            <li>
              <NavLink to="/lazy" className="nav-item" onClick={closeMenu}>
                簡易攻略
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className="nav-item" onClick={closeMenu}>
                常見問題
              </NavLink>
            </li>
            <li>
              <NavLink to="/health" className="nav-item" onClick={closeMenu}>
                健康任務
              </NavLink>
            </li>
            <li>
              <NavLink to="/dose" className="nav-item" onClick={closeMenu}>
                劑量計算
              </NavLink>
            </li>
            <li>
              <NavLink to="/threads" className="nav-item" onClick={closeMenu}>
                精選文章
              </NavLink>
            </li>
            <li>
              <NavLink to="/report" className="nav-item" onClick={closeMenu}>
                回報價格
              </NavLink>
            </li>
          </ul>
        </div>

        {/* LINE + Donate (desktop right / mobile bottom-right floating) */}
        <div className="nav-actions">
          <a
            href="https://line.me/ti/g2/14wNaS4K1nmA7ytMa8pgzTLuslICubxDFVdjuQ"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-line-link"
            onClick={closeMenu}
          >
            <img
              src="/icons8-line-me.svg"
              alt="LINE"
              className="nav-line-icon"
            />
            加入 LINE 群組
          </a>

          <a
            href="https://buymeacoffee.com/holaalbertc"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-coffee-link"
            onClick={closeMenu}
          >
            <img src="/image/bmc-logo.png" alt="請我喝杯咖啡" />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
