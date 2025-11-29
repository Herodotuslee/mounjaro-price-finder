// App.js
import { Routes, Route, NavLink } from "react-router-dom";
import PricePage from "./pages/PricePage";
import FaqPage from "./pages/FaqPage";
import HealthPage from "./pages/HealthPage";
import ReportPriceFormPage from "./pages/ReportPriceFormPage";
import AdvancedPage from "./pages/AdvancedPage";
import "./styles/navbar.css";
import LazyPage from "./pages/LazyPage";
import DoseCalculatorPage from "./pages/DoseCalculatorPage";
import Footer from "./pages/Footer";
import ThreadsPage from "./pages/ThreadsPage";

function App() {
  return (
    <div>
      {/* 🔹 Navbar */}
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
            onMouseEnter={(e) => (e.target.style.color = "#0f766e")}
            onMouseLeave={(e) => (e.target.style.color = "#0f172a")}
          >
            台灣猛健樂資訊網
          </NavLink>

          <ul className="nav-links">
            <li>
              <NavLink to="/" end className="nav-item">
                價格資訊
              </NavLink>
            </li>
            <li className="nav-item-with-tooltip">
              <NavLink to="/lazy" className="nav-item">
                懶人包
              </NavLink>
              <div className="nav-tooltip">
                最精簡的懶人包！搞懂並且都做到，你就是猛健樂使用者的 Pr99了！
              </div>
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
            <li>
              <NavLink to="/dose" className="nav-item">
                劑量計算
              </NavLink>
            </li>
            <li>
              <NavLink to="/report" className="nav-item">
                回報價格
              </NavLink>
            </li>
            <li>
              <NavLink to="/threads" className="nav-item">
                衛教文章
              </NavLink>
            </li>
          </ul>
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

            <a
              href="https://buymeacoffee.com/holaalbertc"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-coffee-link"
            >
              <img
                src="/image/bmc-logo.png"
                alt="Buy me a coffee"
                style={{ height: "30px", objectFit: "contain" }}
              />
            </a>
          </div>
        </div>
      </nav>

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<PricePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/lazy" element={<LazyPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/report" element={<ReportPriceFormPage />} />
        <Route path="/advanced" element={<AdvancedPage />} />
        <Route path="/dose" element={<DoseCalculatorPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
