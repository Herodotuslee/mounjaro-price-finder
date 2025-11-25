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
            {/* <li>
              <NavLink to="/report" className="nav-item">
                回報價格 / 新增診所資訊
              </NavLink>
            </li> */}
          </ul>
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
