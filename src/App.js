// App.js
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar"; // ⬅ 新增
import PricePage from "./pages/PricePage";
import FaqPage from "./pages/FaqPage";
import HealthPage from "./pages/HealthPage";
import ReportPriceFormPage from "./pages/ReportPriceFormPage";
import AdvancedPage from "./pages/AdvancedPage";
import LazyPage from "./pages/LazyPage";
import DoseCalculatorPage from "./pages/DoseCalculatorPage";
import Footer from "./pages/Footer";
import ThreadsPage from "./pages/ThreadsPage";
import "./styles/navbar.css";

function App() {
  return (
    <div>
      <Navbar />
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
