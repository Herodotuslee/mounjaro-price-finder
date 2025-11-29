// src/pages/ReportPriceFormPage.js
import React, { useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { CITY_LABELS } from "../data/prices";
import "../styles/ReportPriceFormPage.css";

const INITIAL_FORM = {
  city: "",
  district: "",
  address: "",
  clinic: "",
  type: "clinic",
  price2_5mg: "",
  price5mg: "",
  price7_5mg: "",
  price10mg: "",
  price12_5mg: "",
  price15mg: "",
  note: "",
};

const CITY_OPTIONS = ["", ...Object.values(CITY_LABELS)];

const TYPE_OPTIONS = [
  { value: "clinic", label: "診所" },
  { value: "hospital", label: "醫院" },
  { value: "pharmacy", label: "藥局" },
  { value: "medical_aesthetic", label: "醫美" },
];

const PRICE_FIELDS = [
  { name: "price2_5mg", label: "2.5 mg" },
  { name: "price5mg", label: "5 mg" },
  { name: "price7_5mg", label: "7.5 mg" },
  { name: "price10mg", label: "10 mg" },
  { name: "price12_5mg", label: "12.5 mg" },
  { name: "price15mg", label: "15 mg" },
];

function ReportPriceFormPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const toNumberOrNull = (value) => {
    const trimmed = (value ?? "").toString().trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isNaN(n) ? null : n;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // 簡單必填檢查
    if (!form.city || !form.clinic.trim()) {
      setMessage({
        type: "error",
        text: "請至少填寫城市與診所 / 醫院 / 藥局 / 醫美診所名稱。",
      });
      return;
    }

    if (
      !form.price2_5mg &&
      !form.price5mg &&
      !form.price7_5mg &&
      !form.price10mg &&
      !form.price12_5mg &&
      !form.price15mg
    ) {
      setMessage({
        type: "error",
        text: "請至少填寫一個劑量的價格（2.5 / 5 / 7.5 / 10 / 12.5 / 15 mg 任一即可）。",
      });
      return;
    }

    const payload = {
      city: form.city.trim(),
      district: form.district.trim() || null,
      address: form.address.trim() || null,
      clinic: form.clinic.trim(),
      type: form.type || null,
      price2_5mg: toNumberOrNull(form.price2_5mg),
      price5mg: toNumberOrNull(form.price5mg),
      price7_5mg: toNumberOrNull(form.price7_5mg),
      price10mg: toNumberOrNull(form.price10mg),
      price12_5mg: toNumberOrNull(form.price12_5mg),
      price15mg: toNumberOrNull(form.price15mg),
      note: form.note.trim() || null,
      status: "pending",
      last_updated: new Date().toISOString().slice(0, 10),
    };

    try {
      setSubmitting(true);

      const url = `${SUPABASE_URL}/rest/v1/mounjaro_reports`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      setForm(INITIAL_FORM);
      setMessage({
        type: "success",
        text: "感謝回報！資料已送出，會先進入回報列表，站長人工審核後才會更新到主表格。",
      });
    } catch (err) {
      console.error("送出回報失敗：", err);
      setMessage({
        type: "error",
        text: "送出資料時發生錯誤，請稍後再試，或聯絡站長協助。",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-page-root">
      <div className="report-page-inner">
        <h1 className="report-title">回報表單</h1>

        <p className="report-subtitle">
          希望健康的體態是每個台灣人都能追求的權利，不再是遙不可及。
        </p>

        <div className="report-info-block">
          <p className="report-info-text">
            感謝你願意協助回報「合理價格」的猛健樂價格促進善的循環，這個網站是靠大家一起維護的民間資訊整理。當然，價格並非唯一因素，如果有推薦好醫師也歡迎告知！
          </p>
          <ul className="report-info-list">
            <li>
              回報的資料<strong>不會直接顯示</strong>
              在主表格中，會先進入回報列表，由站長人工審核（排除重複、錯字、明顯異常價格）後再更新。
            </li>
            <li>
              如果你覺得某位醫師特別細心、溝通良好，也非常歡迎在「備註」欄位簡單寫下推薦與看診經驗，幫助更多人找到好醫師。
            </li>
          </ul>
        </div>

        {message && (
          <div
            className={`report-message ${
              message.type === "success"
                ? "report-message-success"
                : "report-message-error"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          {/* 城市 */}
          <div className="form-field">
            <label className="form-label">城市（必填）</label>
            <select
              value={form.city}
              onChange={handleChange("city")}
              className="form-input"
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === "" ? "請選擇城市" : c}
                </option>
              ))}
            </select>
          </div>

          {/* 地區 */}
          <div className="form-field">
            <label className="form-label">區域 / 行政區（選填）</label>
            <input
              type="text"
              value={form.district}
              onChange={handleChange("district")}
              placeholder="例如：大安、信義、新莊、楠梓…"
              className="form-input"
            />
          </div>

          {/* 診所 / 醫院 / 藥局 / 醫美診所 名稱 */}
          <div className="form-field">
            <label className="form-label">
              診所 / 醫院 / 藥局 / 醫美診所名稱（必填）
            </label>
            <input
              type="text"
              value={form.clinic}
              onChange={handleChange("clinic")}
              placeholder="請填寫完整名稱，避免只寫縮寫或暱稱"
              className="form-input"
            />
          </div>

          {/* 類型 */}
          <div className="form-field">
            <label className="form-label">類型</label>
            <div className="type-options">
              {TYPE_OPTIONS.map((t) => (
                <label key={t.value} className="type-option">
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={form.type === t.value}
                    onChange={handleChange("type")}
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ⭐ 價格區塊（重點美化） */}
          <div className="price-section">
            <div className="price-section-header">
              <div className="price-section-title">價格（至少填一格）</div>
              <div className="price-section-subtitle">
                請填寫單次施打自費金額，單位：新台幣。
              </div>
            </div>

            <div className="price-grid">
              {PRICE_FIELDS.map(({ name, label, placeholder }) => (
                <div key={name} className="price-field">
                  <label className="price-label" htmlFor={name}>
                    {label}
                  </label>
                  <div className="price-input-row">
                    <span className="price-prefix">NT$</span>
                    <input
                      id={name}
                      type="text"
                      inputMode="numeric"
                      value={form[name]}
                      onChange={handleChange(name)}
                      className="price-input"
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 備註 */}
          <div className="form-field">
            <label className="form-label">備註（選填）</label>
            <textarea
              value={form.note}
              onChange={handleChange("note")}
              rows={3}
              className="form-textarea"
            />
          </div>

          {/* 送出按鈕 */}
          <button
            type="submit"
            disabled={submitting}
            className="report-submit-btn"
          >
            {submitting ? "送出中…" : "送出回報"}
          </button>

          <p className="report-submit-note">
            資料送出後不會直接更新主表格，會先進入回報列表，由站長不定期人工檢查、去除重複與異常資料後再更新。
          </p>
        </form>
      </div>
    </div>
  );
}

export default ReportPriceFormPage;
