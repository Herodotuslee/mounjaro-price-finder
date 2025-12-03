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
        {/* Header: Brand + Mobile Toggle */}
        <div className="nav-header-row">
          <NavLink to="/" className="nav-brand" onClick={closeMenu}>
            <span className="brand-icon">🍃</span>
            <span className="brand-text">台灣猛健樂資訊網</span>
          </NavLink>

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

        {/* Main Navigation Links */}
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

        {/* Action Buttons (LINE + Donate) */}
        <div className="nav-actions">
          {/* LINE Button */}
          <a
            href="https://line.me/ti/g2/14wNaS4K1nmA7ytMa8pgzTLuslICubxDFVdjuQ"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn nav-line-link"
            onClick={closeMenu}
          >
            <img
              src="/icons8-line-me.svg"
              alt="LINE"
              className="nav-icon-img"
            />
            <span>加入群組</span>
          </a>

          {/* Donate Button */}
          <a
            href="https://buymeacoffee.com/holaalbertc"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn nav-coffee-link"
            onClick={closeMenu}
          >
            <span className="nav-icon-emoji">☕</span>
            <span>請喝咖啡</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
