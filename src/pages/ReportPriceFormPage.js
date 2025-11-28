// src/pages/ReportPriceFormPage.js
import React, { useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { CITY_LABELS } from "../data/prices";

const INITIAL_FORM = {
  city: "",
  district: "",
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
      clinic: form.clinic.trim(),
      type: form.type || null,
      price2_5mg: toNumberOrNull(form.price2_5mg),
      price5mg: toNumberOrNull(form.price5mg),
      price7_5mg: toNumberOrNull(form.price7_5mg),
      price10mg: toNumberOrNull(form.price10mg),
      price12_5mg: toNumberOrNull(form.price12_5mg),
      price15mg: toNumberOrNull(form.price15mg),
      note: form.note.trim() || null,
      address: null,

      // 放在回報表裡的狀態，預設 pending
      status: "pending",

      // 這筆價格是使用者看到的「最後更新日期」
      last_updated: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
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
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "6px",
            color: "#0f172a",
          }}
        >
          回報表單
        </h1>

        {/* 標語 */}
        <p
          style={{
            marginBottom: "12px",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          希望健康的體態是每個台灣人都能追求的權利，不再是遙不可及。
        </p>

        {/* 說明文字 */}
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#e0f2fe",
            color: "#0f172a",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          <p style={{ marginBottom: "8px" }}>
            感謝你願意協助回報「合理價格」的猛健樂價格促進善的循環，這個網站是靠大家一起維護的民間資訊整理。當然，價格並非唯一因素，如果有推薦好醫師也歡迎告知！
          </p>
          <ul style={{ paddingLeft: "18px", marginBottom: "8px" }}>
            <li>
              回報的資料<strong>不會直接顯示</strong>
              在主表格中，會先進入回報列表，由站長人工審核（排除重複、錯字、明顯異常價格）後再更新。
            </li>
            <li>
              如果你覺得某位醫師特別細心、溝通良好，也非常歡迎在「備註」欄位簡單寫下推薦與看診經驗，幫助更多人找到好醫師。
            </li>
          </ul>
        </div>

        {/* 訊息 */}
        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              lineHeight: 1.6,
              background: message.type === "success" ? "#dcfce7" : "#fee2e2",
              color: message.type === "success" ? "#166534" : "#b91c1c",
            }}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
          }}
        >
          {/* 城市 */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
                color: "#0f172a",
              }}
            >
              城市（必填）
            </label>
            <select
              value={form.city}
              onChange={handleChange("city")}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === "" ? "請選擇城市" : c}
                </option>
              ))}
            </select>
          </div>

          {/* 地區 */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
                color: "#0f172a",
              }}
            >
              區域 / 行政區
            </label>
            <input
              type="text"
              value={form.district}
              onChange={handleChange("district")}
              placeholder="例如：大安、信義、新莊、楠梓…"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          {/* 診所 / 醫院 / 藥局 / 醫美診所 名稱 */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
                color: "#0f172a",
              }}
            >
              診所 / 醫院 / 藥局 / 醫美診所名稱（必填）
            </label>
            <input
              type="text"
              value={form.clinic}
              onChange={handleChange("clinic")}
              placeholder="請填寫完整名稱，避免只寫縮寫或暱稱"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
          </div>

          {/* 類型：改成子彈（radio）選擇 */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "6px",
                color: "#0f172a",
              }}
            >
              類型
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px 16px",
                fontSize: "14px",
                color: "#0f172a",
              }}
            >
              {TYPE_OPTIONS.map((t) => (
                <label
                  key={t.value}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    checked={form.type === t.value}
                    onChange={handleChange("type")}
                    style={{ cursor: "pointer" }}
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 價格區塊 */}
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#f9fafb",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                marginBottom: "8px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              價格（至少填一格）
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "16px 20px",
              }}
            >
              {[
                ["price2_5mg", "2.5 mg"],
                ["price5mg", "5 mg"],
                ["price7_5mg", "7.5 mg"],
                ["price10mg", "10 mg"],
                ["price12_5mg", "12.5 mg"],
                ["price15mg", "15 mg"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label
                    style={{
                      fontSize: "13px",
                      marginBottom: "4px",
                      display: "block",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form[field]}
                    onChange={handleChange(field)}
                    style={{
                      width: "100%",
                      padding: "6px 8px",
                      fontSize: "13px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 備註 */}
          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
                color: "#0f172a",
              }}
            >
              備註（選填）
            </label>
            <textarea
              value={form.note}
              onChange={handleChange("note")}
              rows={3}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                resize: "vertical",
              }}
            />
          </div>

          {/* 送出按鈕 */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "999px",
              border: submitting ? "1px solid #9ca3af" : "1px solid #0d5f59",
              fontSize: "15px",
              fontWeight: 600,
              cursor: submitting ? "default" : "pointer",
              background: submitting ? "#9ca3af" : "#0f766e",
              color: "#ffffff",
              transition: "all 0.15s ease",
              transform: submitting ? "scale(1)" : "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.background = "#0d5f59";
                e.currentTarget.style.transform = "scale(1.015)";
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.background = "#0f766e";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {submitting ? "送出中…" : "送出回報"}
          </button>

          <p
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#0f766e",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            資料送出後不會直接更新主表格，會先進入回報列表，由站長不定期人工檢查、去除重複與異常資料後再更新。
          </p>
        </form>
      </div>
    </div>
  );
}

export default ReportPriceFormPage;
