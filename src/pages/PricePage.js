// src/pages/PricePage.js
import React, { useEffect, useMemo, useState } from "react";
import "../styles/PricePage.css";
import {
  CITY_LABELS,
  TYPE_LABELS,
  TYPES,
  CITY_KEYWORDS,
  TYPE_KEYWORDS,
} from "../data/prices";
import texts from "../data/texts.json";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { FaRegEdit } from "react-icons/fa";

// ---------- Helper functions ----------

// 小工具：避免大小寫/空白差異
const normalize = (value) => (value ?? "").toString().trim().toLowerCase();

// 城市：selectedCity vs row.city（支援台北 / taipei / 臺北）
const cityMatchesSelected = (rowCityRaw, selectedCityValue) => {
  if (selectedCityValue === "all") return true;

  const nRow = normalize(rowCityRaw);
  const nSelected = normalize(selectedCityValue);

  if (nRow === nSelected) return true;

  const keywordsForSelected = CITY_KEYWORDS[selectedCityValue] || [];
  const normalizedKeywords = keywordsForSelected.map(normalize);

  return normalizedKeywords.includes(nRow);
};

// 類型：selectedType vs row.type（支援 診所/clinic/c、醫院/hospital/h、藥局/pharmacy/p）
const typeMatchesSelected = (rowTypeRaw, selectedTypeValue) => {
  if (selectedTypeValue === "all") return true;

  const nRow = normalize(rowTypeRaw || "clinic");
  const nSelected = normalize(selectedTypeValue);

  if (nRow === nSelected) return true;

  const keywordsForSelected = TYPE_KEYWORDS[selectedTypeValue] || [];
  const normalizedKeywords = keywordsForSelected.map(normalize);

  return normalizedKeywords.includes(nRow);
};

// 把 DB 裡的 raw type（診所 / c / clinic / 藥局 / p ...）統一轉成標準代碼
// 標準代碼預期是：clinic / hospital / pharmacy
const getCanonicalTypeCode = (rowTypeRaw) => {
  const n = normalize(rowTypeRaw || "clinic");

  if (TYPE_LABELS[n]) return n;

  for (const [typeCode, keywords] of Object.entries(TYPE_KEYWORDS)) {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(n)) {
      return typeCode;
    }
  }

  return "clinic";
};

// Build keyword variants so that Chinese and English both work（搜尋欄用）
const buildKeywordVariants = (kwRaw) => {
  const kw = normalize(kwRaw);
  if (!kw) return [];

  const variants = new Set([kw]);

  // 城市中英對應
  Object.entries(CITY_KEYWORDS).forEach(([cityCode, keywords]) => {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(kw)) {
      normalizedKeywords.forEach((k) => variants.add(k));
      variants.add(normalize(cityCode));
    }
  });

  // 類型中英對應
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
  if (variants.length === 0) return true;

  const typeCode = getCanonicalTypeCode(row.type);
  const cityCode = row.city || "";
  const cityLabel = CITY_LABELS[cityCode] || "";
  const typeLabel = TYPE_LABELS[typeCode] || "";

  const fields = [
    row.clinic,
    row.district,
    cityCode,
    cityLabel,
    typeCode,
    typeLabel,
  ];

  const normalizedFields = fields.filter(Boolean).map((v) => normalize(v));

  return variants.some((kw) =>
    normalizedFields.some((field) => field.includes(kw))
  );
};

// 價格顯示：null / undefined / 0 → 顯示空白
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

// 將 input 的字串轉成 number 或 null
const toNullableInt = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

// ---------- Component 本體 ----------

function PricePage() {
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 劑量顯示模式：false = 只看 5/10，true = 顯示所有劑量
  const [showAllDoses, setShowAllDoses] = useState(false);

  // 協助更新用的 state
  const [reportTarget, setReportTarget] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportError, setReportError] = useState(null);

  const [reportDistrict, setReportDistrict] = useState("");

  const [reportPrice2_5, setReportPrice2_5] = useState("");
  const [reportPrice5, setReportPrice5] = useState("");
  const [reportPrice7_5, setReportPrice7_5] = useState("");
  const [reportPrice10, setReportPrice10] = useState("");
  const [reportPrice12_5, setReportPrice12_5] = useState("");
  const [reportPrice15, setReportPrice15] = useState("");
  const [reportNote, setReportNote] = useState("");

  // 🔹 Fetch data from Supabase（主表 mounjaro_data）
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

  // 🔍 只顯示真的有資料的城市
  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(rows.map((r) => r.city).filter(Boolean))
    );
    return ["all", ...uniqueCities];
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

  // 🧮 table 欄位總數（備註 + 更新日期 + 協助更新）
  const totalColumns = showAllDoses ? 13 : 9;

  // 開啟協助更新 modal，帶入該筆資料的現有值
  const openReportModal = (row) => {
    setReportTarget(row);
    setReportError(null);

    setReportDistrict(row.district ?? "");
    setReportPrice2_5(row.price2_5mg ?? "");
    setReportPrice5(row.price5mg ?? "");
    setReportPrice7_5(row.price7_5mg ?? "");
    setReportPrice10(row.price10mg ?? "");
    setReportPrice12_5(row.price12_5mg ?? "");
    setReportPrice15(row.price15mg ?? "");
    setReportNote(row.note ?? "");
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setReportError(null);
    setReportSubmitting(false);
  };

  // 送出協助更新 → insert 到 mounjaro_reports（status 預設 pending）
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;

    try {
      setReportSubmitting(true);
      setReportError(null);

      const url = `${SUPABASE_URL}/rest/v1/mounjaro_reports`;

      const body = {
        city: reportTarget.city,
        district: reportDistrict || reportTarget.district || null,
        clinic: reportTarget.clinic,
        type: reportTarget.type || "clinic",
        address: reportTarget.address,
        is_cosmetic: reportTarget.is_cosmetic ?? false,

        price2_5mg: toNullableInt(reportPrice2_5),
        price5mg: toNullableInt(reportPrice5),
        price7_5mg: toNullableInt(reportPrice7_5),
        price10mg: toNullableInt(reportPrice10),
        price12_5mg: toNullableInt(reportPrice12_5),
        price15mg: toNullableInt(reportPrice15),

        note: reportNote || null,
        // 讓 last_updated 設成今天（或你也可以不送，讓後端自己處理）
        last_updated: new Date().toISOString().slice(0, 10),
        // status 用預設 'pending'
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      alert("已送出協助更新，感謝你幫忙維護資訊！");
      closeReportModal();
    } catch (err) {
      console.error("❌ 協助更新送出失敗：", err);
      setReportError("送出失敗，請稍後再試。");
    } finally {
      setReportSubmitting(false);
    }
  };

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

        {/* City filter */}
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
              {c === "all" ? "全部城市" : c}
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

        {/* 劑量顯示模式切換 */}
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => setShowAllDoses(false)}
            className={`filter-btn ${!showAllDoses ? "active" : ""}`}
          >
            只看 5 mg / 10 mg
          </button>
          <button
            type="button"
            onClick={() => setShowAllDoses(true)}
            className={`filter-btn ${showAllDoses ? "active" : ""}`}
          >
            顯示所有劑量
          </button>
        </div>

        {/* 藥局 / 醫院警語 */}
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

        {selectedType === "hospital" && (
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
            {texts.hospitalWarning}
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

                {showAllDoses ? (
                  <>
                    <th>2.5 mg 價格</th>
                    <th>5 mg 價格</th>
                    <th>7.5 mg 價格</th>
                    <th>10 mg 價格</th>
                    <th>12.5 mg 價格</th>
                    <th>15 mg 價格</th>
                  </>
                ) : (
                  <>
                    <th>5 mg 價格</th>
                    <th>10 mg 價格</th>
                  </>
                )}

                <th>備註</th>
                <th>更新日期</th>
                <th>協助更新</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const typeCode = getCanonicalTypeCode(item.type);
                const lastUpdatedText = formatLastUpdated(item.last_updated);

                return (
                  <tr key={`${item.id}-${index}`}>
                    <td className="table-city">
                      {CITY_LABELS[item.city] || item.city || "-"}
                    </td>
                    <td>{item.district || "-"}</td>
                    <td>{TYPE_LABELS[typeCode] || "診所"}</td>
                    <td>{item.clinic}</td>

                    {showAllDoses ? (
                      <>
                        <td>{formatPrice(item.price2_5mg) || "-"}</td>
                        <td>{formatPrice(item.price5mg) || "-"}</td>
                        <td>{formatPrice(item.price7_5mg) || "-"}</td>
                        <td>{formatPrice(item.price10mg) || "-"}</td>
                        <td>{formatPrice(item.price12_5mg) || "-"}</td>
                        <td>{formatPrice(item.price15mg) || "-"}</td>
                      </>
                    ) : (
                      <>
                        <td>{formatPrice(item.price5mg) || "-"}</td>
                        <td>{formatPrice(item.price10mg) || "-"}</td>
                      </>
                    )}

                    <td className="table-note">{item.note || "-"}</td>
                    <td>
                      {lastUpdatedText && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#9ca3af",
                          }}
                        >
                          {lastUpdatedText}
                        </span>
                      )}
                    </td>
                    <td>
                      {/* <button
                        type="button"
                        className="report-icon-btn"
                        onClick={() => openReportModal(item)}
                        title="編輯 / 協助更新此筆資料"
                      >
                        ✏️
                      </button> */}
                      <FaRegEdit
                        type="button"
                        className="report-icon-btn"
                        onClick={() => openReportModal(item)}
                        title="編輯 / 協助更新此筆資料"
                      />
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan={totalColumns}
                    style={{ textAlign: "center", padding: "12px" }}
                  >
                    目前沒有符合條件的資料。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 協助更新 Modal */}
        {reportTarget && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "420px",
                background: "#ffffff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 20px 40px rgba(15,23,42,0.3)",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                協助更新資料
              </h2>

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: "12px",
                  lineHeight: 1.6,
                }}
              >
                謝謝你協助維護本網站的資訊 🙏
                <br />
                提交後需等待站長審核，審核通過後才會正式更新到主資料表。
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: "12px",
                  lineHeight: 1.6,
                }}
              >
                診所：{reportTarget.city} / {reportTarget.district} /{" "}
                {reportTarget.clinic}
              </p>

              <form onSubmit={handleSubmitReport}>
                {/* 地區（選填） */}
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#4b5563",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    地區（選填）
                  </label>
                  <input
                    type="text"
                    value={reportDistrict}
                    onChange={(e) => setReportDistrict(e.target.value)}
                    placeholder="例如：信義區、中西區⋯"
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      fontSize: "12px",
                    }}
                  />
                </div>

                {/* 劑量價格 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px 12px",
                    marginBottom: "12px",
                  }}
                >
                  <label style={{ fontSize: "12px", color: "#4b5563" }}>
                    2.5 mg
                    <input
                      type="number"
                      value={reportPrice2_5}
                      onChange={(e) => setReportPrice2_5(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: "12px",
                      }}
                    />
                  </label>
                  <label style={{ fontSize: "12px", color: "#4b5563" }}>
                    5 mg
                    <input
                      type="number"
                      value={reportPrice5}
                      onChange={(e) => setReportPrice5(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: "12px",
                      }}
                    />
                  </label>
                  <label style={{ fontSize: "12px", color: "#4b5563" }}>
                    7.5 mg
                    <input
                      type="number"
                      value={reportPrice7_5}
                      onChange={(e) => setReportPrice7_5(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: "12px",
                      }}
                    />
                  </label>
                  <label style={{ fontSize: "12px", color: "#4b5563" }}>
                    10 mg
                    <input
                      type="number"
                      value={reportPrice10}
                      onChange={(e) => setReportPrice10(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: "12px",
                      }}
                    />
                  </label>
                  <label style={{ fontSize: "12px", color: "#4b5563" }}>
                    12.5 mg
                    <input
                      type="number"
                      value={reportPrice12_5}
                      onChange={(e) => setReportPrice12_5(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: "12px",
                      }}
                    />
                  </label>
                  <label style={{ fontSize: "12px", color: "#4b5563" }}>
                    15 mg
                    <input
                      type="number"
                      value={reportPrice15}
                      onChange={(e) => setReportPrice15(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "4px 6px",
                        fontSize: "12px",
                      }}
                    />
                  </label>
                </div>

                {/* 備註 */}
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#4b5563",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    備註（選填）
                  </label>
                  <textarea
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      fontSize: "12px",
                      resize: "vertical",
                    }}
                    placeholder="例如：最近調漲、包含掛號費、分次販售等補充資訊⋯"
                  />
                </div>

                {/* 錯誤訊息 */}
                {reportError && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#b91c1c",
                      marginBottom: "8px",
                    }}
                  >
                    {reportError}
                  </p>
                )}

                {/* 按鈕區 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={closeReportModal}
                    style={{
                      padding: "6px 10px",
                      fontSize: "13px",
                      borderRadius: "999px",
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                      cursor: reportSubmitting ? "default" : "pointer",
                    }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    style={{
                      padding: "6px 14px",
                      fontSize: "13px",
                      borderRadius: "999px",
                      border: "1px solid #0f766e",
                      background: reportSubmitting ? "#9ca3af" : "#0f766e",
                      color: "#f9fafb",
                      cursor: reportSubmitting ? "default" : "pointer",
                    }}
                  >
                    {reportSubmitting ? "提交中…" : "提交協助更新"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricePage;
