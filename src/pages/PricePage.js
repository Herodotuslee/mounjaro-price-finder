// src/pages/PricePage.js
import React, { useMemo, useState } from "react";
import "../styles/PricePage.css";
import {
  CITY_LABELS,
  TYPE_LABELS,
  CITIES,
  TYPES,
  MOCK_DATA,
} from "../data/prices";

function PricePage() {
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((row) => {
      const cityOk = selectedCity === "all" || row.city === selectedCity;
      const typeOk = selectedType === "all" || row.type === selectedType;

      const kw = keyword.trim();
      const kwOk =
        kw === "" ||
        (row.clinic && row.clinic.includes(kw)) ||
        (row.district && row.district.includes(kw));

      return cityOk && typeOk && kwOk;
    });
  }, [selectedCity, selectedType, keyword]);

  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "6px" }}
        >
          台灣各城市猛健樂價格整理（5mg / 10mg）
        </h1>
        <p style={{ fontSize: "13px", color: "#4b5563", marginBottom: "16px" }}>
          價格僅供參考，實際以各醫療院所公告為主。
        </p>

        {/* 城市 filter */}
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`filter-btn ${c === selectedCity ? "active" : ""}`}
            >
              {c === "all" ? "全部城市" : CITY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* 類型 filter */}
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`filter-btn ${t === selectedType ? "active" : ""}`}
            >
              {t === "all" ? "全部類型" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* 搜尋 */}
        <input
          placeholder="搜尋診所 / 地區"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: "8px",
            marginBottom: "20px",
            maxWidth: "260px",
            width: "100%",
          }}
        />

        {/* 表格 */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>城市</th>
                <th>地區</th>
                <th>類型</th>
                <th>名稱</th>
                <th>5 mg 價格</th>
                <th>10 mg 價格</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="table-city">{CITY_LABELS[item.city]}</td>{" "}
                  {/* 城市 */}
                  <td>{item.district || "-"}</td> {/* 地區 */}
                  <td>{TYPE_LABELS[item.type]}</td> {/* 類型 */}
                  <td>{item.clinic}</td> {/* 名稱 */}
                  <td>{item.price5mg || "-"}</td> {/* 5mg */}
                  <td>{item.price10mg || "-"}</td> {/* 10mg */}
                  <td className="table-note">{item.note || "-"}</td>{" "}
                  {/* 備註 */}
                </tr>
              ))}
            </tbody>{" "}
          </table>
        </div>
      </div>
    </div>
  );
}

export default PricePage;
