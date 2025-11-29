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
import { FaRegEdit, FaChevronUp, FaChevronDown } from "react-icons/fa";
import PriceReportModal from "../components/PriceReportModal";

// ---------- Helper functions ----------
const normalize = (value) => (value ?? "").toString().trim().toLowerCase();

// 城市篩選：支援關鍵字 mapping
const cityMatchesSelected = (rowCityRaw, selectedCityValue) => {
  if (selectedCityValue === "all") return true;

  const nRow = normalize(rowCityRaw);
  const nSelected = normalize(selectedCityValue);
  if (nRow === nSelected) return true;

  const keywordsForSelected = CITY_KEYWORDS[selectedCityValue] || [];
  const normalizedKeywords = keywordsForSelected.map(normalize);
  return normalizedKeywords.includes(nRow);
};

// 類型篩選：支援 mapping
const typeMatchesSelected = (rowTypeRaw, selectedTypeValue) => {
  if (selectedTypeValue === "all") return true;

  const nRow = normalize(rowTypeRaw || "clinic");
  const nSelected = normalize(selectedTypeValue);
  if (nRow === nSelected) return true;

  const keywordsForSelected = TYPE_KEYWORDS[selectedTypeValue] || [];
  const normalizedKeywords = keywordsForSelected.map(normalize);
  return normalizedKeywords.includes(nRow);
};

// 將 raw type normalize 成 canonical type code
const getCanonicalTypeCode = (rowTypeRaw) => {
  const n = normalize(rowTypeRaw || "clinic");
  if (TYPE_LABELS[n]) return n;

  for (const [typeCode, keywords] of Object.entries(TYPE_KEYWORDS)) {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(n)) return typeCode;
  }

  return "clinic";
};

// 建立關鍵字 variants（城市/類型 alias）
const buildKeywordVariants = (kwRaw) => {
  const kw = normalize(kwRaw);
  if (!kw) return [];
  const variants = new Set([kw]);

  Object.entries(CITY_KEYWORDS).forEach(([cityCode, keywords]) => {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(kw)) {
      normalizedKeywords.forEach((k) => variants.add(k));
      variants.add(normalize(cityCode));
    }
  });

  Object.entries(TYPE_KEYWORDS).forEach(([typeCode, keywords]) => {
    const normalizedKeywords = keywords.map(normalize);
    if (normalizedKeywords.includes(kw)) {
      normalizedKeywords.forEach((k) => variants.add(k));
      variants.add(normalize(typeCode));
    }
  });

  return Array.from(variants);
};

// 文字搜尋
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

const formatPrice = (value) => {
  if (value === null || value === undefined || value === 0) return "";
  return value;
};

const formatLastUpdated = (lastUpdatedRaw) => {
  if (!lastUpdatedRaw) return "";
  const d = new Date(lastUpdatedRaw);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

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

  // 劑量顯示：只看 5/10 或全部
  const [showAllDoses, setShowAllDoses] = useState(false);

  // 手機版 & table：控制哪一筆備註展開
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // 協助更新 Modal 狀態
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

  // 判斷是否為手機寬度（簡單版）
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 載入 Supabase 資料
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

  // 城市選項（自動從資料抓）
  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(rows.map((r) => r.city).filter(Boolean))
    );
    return ["all", ...uniqueCities];
  }, [rows]);

  // 篩選 + 搜尋
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

  const totalColumns = showAllDoses ? 13 : 9;

  // 開啟協助更新 modal
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

  // 提交協助更新
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
        price2_5mg: toNullableInt(reportPrice2_5),
        price5mg: toNullableInt(reportPrice5),
        price7_5mg: toNullableInt(reportPrice7_5),
        price10mg: toNullableInt(reportPrice10),
        price12_5mg: toNullableInt(reportPrice12_5),
        price15mg: toNullableInt(reportPrice15),
        note: reportNote || null,
        last_updated: new Date().toISOString().slice(0, 10),
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
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* 頁首 */}
        <header className="page-header">
          <h1 className="page-title">全國猛健樂價格整理</h1>
          <p className="page-subtitle">
            整理台灣各縣市診所與藥局的自費價格資訊，方便查詢與比較。
          </p>
        </header>

        {/* 主要 disclaimer */}
        <div className="disclaimer-block">⚠️ {texts.disclaimer}</div>

        {loading && <p className="status-text">正在載入最新價格資料⋯⋯</p>}
        {error && <p className="status-text error">{error}</p>}

        {/* Filter 區域（卡片） */}
        <section className="control-card">
          {/* 城市 filter */}
          <div className="filter-group">
            {cityOptions.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`filter-btn ${c === selectedCity ? "active" : ""}`}
              >
                {c === "all" ? "全部城市" : CITY_LABELS[c] || c}
              </button>
            ))}
          </div>

          {/* 類型 filter */}
          <div className="filter-group">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              className={`filter-btn ${selectedType === "all" ? "active" : ""}`}
            >
              全部類型
            </button>
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`filter-btn ${t === selectedType ? "active" : ""}`}
              >
                {TYPE_LABELS[t] || t}
              </button>
            ))}
          </div>

          {/* 劑量顯示模式切換 */}
          <div className="filter-group">
            <button
              type="button"
              onClick={() => setShowAllDoses(false)}
              className={`filter-btn ${!showAllDoses ? "active" : ""}`}
            >
              常見 5 mg / 10 mg
            </button>
            <button
              type="button"
              onClick={() => setShowAllDoses(true)}
              className={`filter-btn ${showAllDoses ? "active" : ""}`}
            >
              顯示所有劑量
            </button>
          </div>

          {/* 類型警語 */}
          {selectedType === "pharmacy" && (
            <div className="warning-block">{texts.pharmacyWarning}</div>
          )}
          {selectedType === "hospital" && (
            <div className="warning-block">{texts.hospitalWarning}</div>
          )}

          {/* 搜尋欄位 */}
          <input
            placeholder="搜尋診所 / 地區 / 城市 / 類型"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
        </section>

        {/* 結果區：手機用 card，桌機用表格 */}
        {!loading && !error && (
          <>
            {isMobile ? (
              <section className="card-list">
                {filteredData.map((item, index) => {
                  const typeCode = getCanonicalTypeCode(item.type);
                  const note = item.note || "";
                  const price2_5 = formatPrice(item.price2_5mg);
                  const price5 = formatPrice(item.price5mg);
                  const price7_5 = formatPrice(item.price7_5mg);
                  const price10 = formatPrice(item.price10mg);
                  const price12_5 = formatPrice(item.price12_5mg);
                  const price15 = formatPrice(item.price15mg);

                  return (
                    <article
                      key={`${item.id}-${index}-card`}
                      className="clinic-card"
                    >
                      <div className="clinic-card-header">
                        <div className="clinic-name">
                          {item.clinic || "未命名診所"}
                        </div>
                        <div className="clinic-meta">
                          <span>
                            {CITY_LABELS[item.city] || item.city || "-"}
                          </span>
                          {item.district && <span> · {item.district}</span>}
                          <span> · {TYPE_LABELS[typeCode] || "診所"}</span>
                        </div>
                      </div>

                      <div className="clinic-prices">
                        {showAllDoses ? (
                          <div className="dose-grid">
                            {price2_5 && (
                              <span className="price-box">
                                2.5 mg：{price2_5}
                              </span>
                            )}
                            {price5 && (
                              <span className="price-box">5 mg：{price5}</span>
                            )}
                            {price7_5 && (
                              <span className="price-box">
                                7.5 mg：{price7_5}
                              </span>
                            )}
                            {price10 && (
                              <span className="price-box">
                                10 mg：{price10}
                              </span>
                            )}
                            {price12_5 && (
                              <span className="price-box">
                                12.5 mg：{price12_5}
                              </span>
                            )}
                            {price15 && (
                              <span className="price-box">
                                15 mg：{price15}
                              </span>
                            )}
                          </div>
                        ) : (
                          <>
                            {price5 && (
                              <span className="price-box">5 mg：{price5}</span>
                            )}
                            {price10 && (
                              <span className="price-box">
                                10 mg：{price10}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {note && (
                        <div className="clinic-note">
                          <div className="note-text">{note}</div>
                        </div>
                      )}
                      <div className="clinic-footer">
                        <button
                          type="button"
                          className="clinic-edit-btn"
                          onClick={() => openReportModal(item)}
                        >
                          <FaRegEdit className="clinic-edit-icon" />
                          <span>協助更新</span>
                        </button>
                      </div>
                    </article>
                  );
                })}

                {filteredData.length === 0 && (
                  <p className="status-text">目前沒有符合條件的資料。</p>
                )}
              </section>
            ) : (
              <section className="table-card">
                <div className="table-scroll">
                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>城市</th>
                        <th>地區</th>
                        <th>類型</th>
                        <th>名稱</th>

                        {showAllDoses ? (
                          <>
                            <th>2.5 mg</th>
                            <th>5 mg</th>
                            <th>7.5 mg</th>
                            <th>10 mg</th>
                            <th>12.5 mg</th>
                            <th>15 mg</th>
                          </>
                        ) : (
                          <>
                            <th>5 mg</th>
                            <th>10 mg</th>
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
                        const lastUpdatedText = formatLastUpdated(
                          item.last_updated
                        );
                        const note = item.note || "-";
                        const isExpanded = expandedNoteId === item.id;

                        return (
                          <tr key={`${item.id}-${index}-row`}>
                            <td className="col-city">
                              {CITY_LABELS[item.city] || item.city || "-"}
                            </td>
                            <td>{item.district || "-"}</td>
                            <td className="col-type">
                              {TYPE_LABELS[typeCode] || "診所"}
                            </td>
                            <td className="col-clinic">{item.clinic}</td>

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

                            <td
                              className={`col-note ${
                                isExpanded ? "note-expanded" : "note-collapsed"
                              }`}
                            >
                              <div className="note-text">{note}</div>
                              {item.note && item.note.length > 30 && (
                                <button
                                  type="button"
                                  className="note-toggle"
                                  onClick={() =>
                                    setExpandedNoteId(
                                      isExpanded ? null : item.id
                                    )
                                  }
                                >
                                  {isExpanded ? (
                                    <FaChevronUp className="note-icon" />
                                  ) : (
                                    <FaChevronDown className="note-icon" />
                                  )}
                                </button>
                              )}
                            </td>
                            <td>
                              {lastUpdatedText && (
                                <span className="last-updated">
                                  {lastUpdatedText}
                                </span>
                              )}
                            </td>
                            <td>
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

                      {filteredData.length === 0 && (
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
              </section>
            )}
          </>
        )}

        {/* 協助更新 Modal（抽成獨立元件） */}
        {reportTarget && (
          <PriceReportModal
            target={reportTarget}
            reportSubmitting={reportSubmitting}
            reportError={reportError}
            onClose={closeReportModal}
            handleSubmitReport={handleSubmitReport}
            reportDistrict={reportDistrict}
            setReportDistrict={setReportDistrict}
            reportPrice2_5={reportPrice2_5}
            setReportPrice2_5={setReportPrice2_5}
            reportPrice5={reportPrice5}
            setReportPrice5={setReportPrice5}
            reportPrice7_5={reportPrice7_5}
            setReportPrice7_5={setReportPrice7_5}
            reportPrice10={reportPrice10}
            setReportPrice10={setReportPrice10}
            reportPrice12_5={reportPrice12_5}
            setReportPrice12_5={setReportPrice12_5}
            reportPrice15={reportPrice15}
            setReportPrice15={setReportPrice15}
            reportNote={reportNote}
            setReportNote={setReportNote}
          />
        )}
      </div>
    </div>
  );
}

export default PricePage;
