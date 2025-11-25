// App.js
import { Routes, Route, NavLink } from "react-router-dom";
import PricePage from "./pages/PricePage";
import FaqPage from "./pages/FaqPage";
import HealthPage from "./pages/HealthPage";
import "./styles/navbar.css";

function App() {
  return (
    <div>
      {/* 🔹 Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">台灣猛健樂資訊網</div>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className="nav-item">
                價格比價
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className="nav-item">
                與猛健樂有關的常見問題
              </NavLink>
            </li>
            <li>
              <NavLink to="/health" className="nav-item">
                減肥相關的健康與營養知識
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<PricePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </div>
  );
}

export default App;
