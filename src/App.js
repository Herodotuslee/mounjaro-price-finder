// App.js
import { Routes, Route, NavLink } from "react-router-dom";
import PricePage from "./pages/PricePage";
import FaqPage from "./pages/FaqPage";
import HealthPage from "./pages/HealthPage";
import "./styles/navbar.css";
import ReportPriceFormPage from "./pages/ReportPriceFormPage";

function App() {
  return (
    <div>
      {/* 🔹 Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <NavLink
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 22,
              color: "#0f172a",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.color = "#0f172a")}
          >
            全國猛健樂資訊網
          </NavLink>

          <ul className="nav-links">
            <li>
              <NavLink to="/" end className="nav-item">
                價格資訊
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className="nav-item">
                常見問題
              </NavLink>
            </li>
            <li>
              <NavLink to="/health" className="nav-item">
                健康知識
              </NavLink>
            </li>
          </ul>

          {/* ⭐ 右側 icon 區塊 */}
          <div className="nav-actions">
            {/* LINE icon */}
            <a
              href="https://line.me/ti/g2/14wNaS4K1nmA7ytMa8pgzTLuslICubxDFVdjuQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-line-link"
            >
              <img
                src="/icons8-line-me.svg"
                alt="LINE"
                className="nav-line-icon"
              />
              加入LINE群組
            </a>

            {/* Buy Me a Coffee icon */}
            <a
              href="https://buymeacoffee.com/holaalbertc"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-coffee-link"
            >
              ☕
            </a>
          </div>
        </div>
      </nav>

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<PricePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/report" element={<ReportPriceFormPage />} />
      </Routes>
    </div>
  );
}

export default App;
