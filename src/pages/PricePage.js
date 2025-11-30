// src/pages/PricePage.js

import React, { useEffect, useMemo, useState } from "react";
import "../styles/PricePage.css";
import { TYPE_LABELS, TYPES } from "../data/prices";
import texts from "../data/texts.json";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import PriceReportModal from "../components/PriceReportModal";
import PriceTable from "../components/PriceTable";
import PriceCardList from "../components/PriceCardList";
import useIsMobile from "../hooks/useIsMobile.js";
import {
  cityMatchesSelected,
  typeMatchesSelected,
  matchesKeyword,
  toNullableInt,
} from "../utils/priceHelpers";
import LoadingIndicator from "../components/LoadingIndicator.js";

// ---------- Component ----------
function PricePage() {
  // Filters
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  // Data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dose display mode: only 5/10 mg vs all doses
  const [showAllDoses, setShowAllDoses] = useState(false);

  // Desktop: which note row is expanded
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  // Report modal state
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

  // Simple mobile width detection
  const isMobile = useIsMobile(640);

  // Load data from Supabase once on mount
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
        setRows(data || []);
      } catch (err) {
        console.error("Failed to load price data from Supabase:", err);
        setError("載入資料時發生問題，請稍後再試。");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Build city filter options from data itself
  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(rows.map((r) => r.city).filter(Boolean))
    );
    return ["all", ...uniqueCities];
  }, [rows]);

  // Apply filters + keyword search
  const filteredData = useMemo(
    () =>
      rows.filter((row) => {
        const cityOk = cityMatchesSelected(row.city, selectedCity);
        const typeOk = typeMatchesSelected(row.type, selectedType);
        const kwOk = matchesKeyword(row, keyword);
        return cityOk && typeOk && kwOk;
      }),
    [rows, selectedCity, selectedType, keyword]
  );

  // Open report modal and prefill fields
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

  // Submit report to mounjaro_reports
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
      console.error("Failed to submit price update report:", err);
      setReportError("送出失敗，請稍後再試。");
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-title">全國猛健樂價格整理</h1>
          <p className="page-subtitle">
            整理台灣各縣市診所與藥局的自費價格資訊，方便查詢與比較。
          </p>
        </header>

        {/* Main disclaimer */}
        <div className="info-banner warning-block">⚠️ {texts.disclaimer}</div>

        {loading && <LoadingIndicator centered={true} />}
        {error && <p className="status-text error">{error}</p>}

        {/* Filters */}
        <section className="control-card">
          {/* City filter */}
          <div className="filter-group">
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

          {/* Dose display mode */}
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

          {/* Type warnings */}
          {selectedType === "pharmacy" && (
            <div className="warning-block">{texts.pharmacyWarning}</div>
          )}
          {selectedType === "hospital" && (
            <div className="warning-block">{texts.hospitalWarning}</div>
          )}

          {/* Keyword search */}
          <input
            placeholder="搜尋診所 / 地區 / 城市 / 類型"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
        </section>

        {/* Result area */}
        {!loading && !error && (
          <>
            {isMobile ? (
              <PriceCardList
                data={filteredData}
                showAllDoses={showAllDoses}
                onOpenReport={openReportModal}
              />
            ) : (
              <PriceTable
                data={filteredData}
                showAllDoses={showAllDoses}
                expandedNoteId={expandedNoteId}
                setExpandedNoteId={setExpandedNoteId}
                onOpenReport={openReportModal}
              />
            )}
          </>
        )}

        {/* Report modal */}
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
