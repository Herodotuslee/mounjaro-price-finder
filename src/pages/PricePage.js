// src/pages/PricePage.js
import React, { useEffect, useMemo, useState } from "react";
import "../styles/PricePage.css";
import {
  CITY_LABELS,
  TYPE_LABELS,
  CITIES,
  TYPES,
  CITY_KEYWORDS,
  TYPE_KEYWORDS,
} from "../data/prices";
import texts from "../data/texts.json";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

// ---------- Helper functions (搬到 component 外面，避免 useMemo dependency 問題) ----------

// Utility: avoid issues from casing / whitespace differences
const normalize = (value) => (value ?? "").toString().trim().toLowerCase();

// 城市：selectedCity vs row.city（支援台北 / taipei / 臺北）
const cityMatchesSelected = (rowCityRaw, selectedCityValue) => {
  if (selectedCityValue === "all") return true;

  const nRow = normalize(rowCityRaw);
  const nSelected = normalize(selectedCityValue);

  // 完全相同（row.city 已經是 taipei 等）
  if (nRow === nSelected) return true;

  const keywordsForSelected = CITY_KEYWORDS[selectedCityValue] || [];
  const normalizedKeywords = keywordsForSelected.map(normalize);

  return normalizedKeywords.includes(nRow);
};

// 類型：selectedType vs row.type（支援 診所/clinic/c、醫院/hospital/h、藥局/pharmacy/p）
const typeMatchesSelected = (rowTypeRaw, selectedTypeValue) => {
  if (selectedTypeValue === "all") return true;

  // 空 type 視為診所
  const nRow = normalize(rowTypeRaw || "clinic");
  const nSelected = normalize(selectedTypeValue);

  if (nRow === nSelected) return true;

  const keywordsForSelected = TYPE_KEYWORDS[selectedTypeValue] || [];
  const normalizedKeywords = keywordsForSelected.map(normalize);

  return normalizedKeywords.includes(nRow);
};

// Build keyword variants so that Chinese and English both work（搜尋欄用）
const buildKeywordVariants = (kwRaw) => {
  const kw = normalize(kwRaw);
  if (!kw) return [];

  const variants = new Set([kw]);

  // 🔹 城市中英對應
  Object.entries(CITY_KEYWORDS).forEach(([cityCode, keywords]) => {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(kw)) {
      normalizedKeywords.forEach((k) => variants.add(k));
      variants.add(normalize(cityCode));
    }
  });

  // 🔹 類型中英對應
  Object.entries(TYPE_KEYWORDS).forEach(([typeCode, keywords]) => {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(kw)) {
      normalizedKeywords.forEach((k) => variants.add(k));
      variants.add(normalize(typeCode));
    }
  });

  return Array.from(variants);
};

// Check if a row matches the current keyword (Chinese and English aware)
const matchesKeyword = (row, kwRaw) => {
  const variants = buildKeywordVariants(kwRaw);
  if (variants.length === 0) return true; // 沒輸入關鍵字就當作有 match

  const rowTypeRaw = normalize(row.type);
  const effectiveType = rowTypeRaw || "clinic";

  const cityCode = row.city || "";
  const cityLabel = CITY_LABELS[cityCode] || "";
  const typeLabel = TYPE_LABELS[effectiveType] || "";

  const fields = [
    row.clinic,
    row.district,
    cityCode,
    cityLabel,
    effectiveType,
    typeLabel,
  ];

  const normalizedFields = fields.filter(Boolean).map((v) => normalize(v));

  return variants.some((kw) =>
    normalizedFields.some((field) => field.includes(kw))
  );
};

// Display rules: null / undefined / 0 → empty
const formatPrice = (value) => {
  if (value === null || value === undefined || value === 0) return "";
  return value;
};

// 更新日期顯示（全部顯示，只要有 last_updated；沒有就空）
const formatLastUpdated = (lastUpdatedRaw) => {
  if (!lastUpdatedRaw) return "";
  const d = new Date(lastUpdatedRaw);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

// ---------- Component 本體 ----------

function PricePage() {
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const url = `${SUPABASE_URL}/rest/v1/mounjaro_data?select=*`;

        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log("✔ Supabase 回傳 rows：", data);
        setRows(data || []);
      } catch (err) {
        console.error("❌ 載入 Supabase 價格資料失敗:", err);
        setError("載入資料時發生問題，請稍後再試。");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 🔍 Only show cities that actually contain data (always keep "all")
  const cityOptions = useMemo(() => {
    if (!rows || rows.length === 0) {
      return CITIES;
    }

    const hasData = new Set(
      rows.map((r) => r.city).filter(Boolean) // Remove null / undefined / empty string
    );

    return CITIES.filter((c) => c === "all" || hasData.has(c));
  }, [rows]);

  // 🔍 Filtering logic
  const filteredData = useMemo(() => {
    const result = rows.filter((row) => {
      const rowTypeRaw = row.type;

      const cityOk = cityMatchesSelected(row.city, selectedCity);
      const typeOk = typeMatchesSelected(rowTypeRaw, selectedType);
      const kwOk = matchesKeyword(row, keyword);

      return cityOk && typeOk && kwOk;
    });

    console.log("📌 filter 狀態：", {
      selectedCity,
      selectedType,
      keyword,
      totalRows: rows.length,
      filteredRows: result.length,
    });

    return result;
  }, [rows, selectedCity, selectedType, keyword]);

  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "6px" }}
        >
          全台猛健樂價格整理（5mg / 10mg）
        </h1>

        {/* 🔶 Disclaimer */}
        <div
          style={{
            marginTop: "8px",
            marginBottom: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fef3c7",
            fontWeight: 600,
            color: "#92400e",
            lineHeight: 1.6,
          }}
        >
          ⚠️ {texts.disclaimer}
        </div>

        {/* Loading / Error */}
        {loading && (
          <p
            style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}
          >
            正在載入最新價格資料⋯⋯
          </p>
        )}
        {error && (
          <p
            style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "8px" }}
          >
            {error}
          </p>
        )}

        {/* City filter (only cities with data) */}
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {cityOptions.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`filter-btn ${c === selectedCity ? "active" : ""}`}
            >
              {c === "all" ? "全部城市" : CITY_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Type filter */}
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

        {/* ⭐ Pharmacy warning displayed only when pharmacy is selected */}
        {selectedType === "pharmacy" && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: "14px",
              lineHeight: 1.7,
              fontWeight: 600,
            }}
          >
            {texts.pharmacyWarning}
          </div>
        )}

        {/* Search bar */}
        <input
          placeholder="搜尋診所 / 地區 / 城市 / 類型"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: "8px",
            marginBottom: "20px",
            maxWidth: "260px",
            width: "100%",
          }}
        />

        {/* Table */}
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
                <th>更新日期</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const effectiveType = normalize(item.type) || "clinic";
                const lastUpdatedText = formatLastUpdated(item.last_updated);

                return (
                  <tr key={`${item.id}-${index}`}>
                    <td className="table-city">
                      {CITY_LABELS[item.city] || item.city || "-"}
                    </td>
                    <td>{item.district || "-"}</td>
                    <td>{TYPE_LABELS[effectiveType] || "診所"}</td>
                    <td>{item.clinic}</td>
                    <td>{formatPrice(item.price5mg)}</td>
                    <td>{formatPrice(item.price10mg)}</td>
                    <td>
                      {lastUpdatedText && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#9ca3af", // 淡灰色，不會太顯眼
                          }}
                        >
                          {lastUpdatedText}
                        </span>
                      )}
                    </td>
                    <td className="table-note">{item.note || "-"}</td>
                  </tr>
                );
              })}

              {!loading && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "12px" }}
                  >
                    目前沒有符合條件的資料。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PricePage;
