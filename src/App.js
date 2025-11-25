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
                全國價格資訊
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className="nav-item">
                猛健樂有關的常見問題
              </NavLink>
            </li>
            <li>
              <NavLink to="/health" className="nav-item">
                減肥相關的健康與營養知識
              </NavLink>
            </li>
          </ul>

          {/* ⭐ LINE icon (使用 public/icons8-line-me.svg) */}
          <a
            href="https://line.me/ti/g2/14wNaS4K1nmA7ytMa8pgzTLuslICubxDFVdjuQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "16px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#10b981",
              fontWeight: 500,
              fontSize: "14px",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <img
              src="/icons8-line-me.svg"
              alt="LINE"
              style={{
                width: "22px",
                height: "22px",
                marginRight: "6px",
              }}
            />
            加入 LINE 群組
          </a>
          {/* ⭐ Buy Me a Coffee icon */}
          <a
            href="https://buymeacoffee.com/holaalbertc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "16px",
              fontSize: "20px",
              textDecoration: "none",
              cursor: "pointer",
              color: "#6b7280",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#f59e0b")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >
            ☕
          </a>
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
