// src/pages/PricePage.js
import React, { useEffect, useMemo, useState } from "react";
import "../styles/PricePage.css";
import { CITY_LABELS, TYPE_LABELS, CITIES, TYPES } from "../data/prices";
import texts from "../data/texts.json";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

function PricePage() {
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 小工具：避免大小寫/空白差異
  const normalize = (value) => (value ?? "").toString().trim().toLowerCase();

  // 價格顯示：null / undefined / 0 → 顯示空白
  const formatPrice = (value) => {
    if (value === null || value === undefined || value === 0) return "";
    return value;
  };

  // 🔹 從 Supabase 拉資料
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

  // 🔍 只顯示「有資料」的城市（永遠保留 all）
  const cityOptions = useMemo(() => {
    if (!rows || rows.length === 0) {
      return CITIES;
    }

    const hasData = new Set(
      rows.map((r) => r.city).filter(Boolean) // 去掉 null / undefined / 空字串
    );

    return CITIES.filter((c) => c === "all" || hasData.has(c));
  }, [rows]);

  // 🔍 Filter 資料（type 空白視為 clinic）
  const filteredData = useMemo(() => {
    const nSelectedCity = normalize(selectedCity);
    const nSelectedType = normalize(selectedType);

    const result = rows.filter((row) => {
      const rowCity = normalize(row.city);

      // type 空白 → 預設 clinic
      const rowTypeRaw = normalize(row.type);
      const effectiveType = rowTypeRaw || "clinic";

      const cityOk = nSelectedCity === "all" || rowCity === nSelectedCity;

      let typeOk = true;
      if (nSelectedType !== "all") {
        if (nSelectedType === "clinic") {
          // 點「診所」時：包含 type 是空白 + "clinic"
          typeOk = effectiveType === "clinic";
        } else {
          // 其他類型（hospital / pharmacy）必須真的有標 type
          typeOk = rowTypeRaw === nSelectedType;
        }
      }

      const kw = keyword.trim();
      const kwOk =
        kw === "" ||
        (row.clinic && row.clinic.includes(kw)) ||
        (row.district && row.district.includes(kw));

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
          台灣各城市猛健樂價格整理（5mg / 10mg）
        </h1>

        {/* 🔶 免責聲明 */}
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

        {/* 城市 filter（只顯示有資料的城市） */}
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
              {filteredData.map((item, index) => {
                const rowTypeRaw = normalize(item.type);
                const effectiveType = rowTypeRaw || "clinic"; // 顯示時沒填也當診所

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
                    <td className="table-note">{item.note || "-"}</td>
                  </tr>
                );
              })}

              {!loading && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
