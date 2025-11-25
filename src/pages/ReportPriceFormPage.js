// src/components/ReportPriceForm.jsx
import React, { useState } from "react";
import { CITIES, TYPES, CITY_LABELS, TYPE_LABELS } from "../data/prices";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

// Helper: filter out "all" option for reporting
const REPORT_CITY_OPTIONS = CITIES.filter((c) => c !== "all");
const REPORT_TYPE_OPTIONS = TYPES.filter((t) => t !== "all");

function ReportPriceFormPage() {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [clinic, setClinic] = useState("");
  const [type, setType] = useState("clinic");
  const [price5mg, setPrice5mg] = useState("");
  const [price10mg, setPrice10mg] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Basic validation before submit
  const validate = () => {
    if (!city) return "請選擇城市";
    if (!clinic.trim()) return "請填寫診所 / 醫院 / 藥局名稱";

    const has5 = price5mg !== "" && !Number.isNaN(Number(price5mg));
    const has10 = price10mg !== "" && !Number.isNaN(Number(price10mg));

    if (!has5 && !has10) {
      return "請至少填寫 5mg 或 10mg 的價格其中一項";
    }

    const num5 = Number(price5mg);
    const num10 = Number(price10mg);

    // Strict price limitations (invisible to user, only used for validation)
    if (has5 && (num5 < 1000 || num5 > 13000)) {
      return "5mg 價格需介於 1000～13000 元之間";
    }

    if (has10 && (num10 < 1000 || num10 > 16000)) {
      return "10mg 價格需介於 1000～16000 元之間";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        city,
        district: district.trim() || null,
        clinic: clinic.trim(),
        type,
        price5mg: price5mg === "" ? null : Number(price5mg),
        price10mg: price10mg === "" ? null : Number(price10mg),
        note: note.trim() || null,
        email: email.trim() || null,
      };

      const url = `${SUPABASE_URL}/rest/v1/price_reports`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      // Clear form after success
      setCity("");
      setDistrict("");
      setClinic("");
      setType("clinic");
      setPrice5mg("");
      setPrice10mg("");
      setNote("");
      setEmail("");

      setSuccessMsg("感謝回報！我們會在人工審核後再更新到主表。");
    } catch (err) {
      console.error("❌ Failed to submit price report:", err);
      setErrorMsg("送出失敗，請稍後再試一次，或截圖回報給版主。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "6px",
          }}
        >
          回報價格 / 新增診所資訊
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            marginBottom: "16px",
            lineHeight: 1.6,
          }}
        >
          若你有不同的價格資訊，歡迎協助回報。所有資料會先經過人工審核，確認後才會公開顯示。
        </p>

        {/* Form container (narrower than full width) */}
        <div
          style={{
            maxWidth: "600px",
            background: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            padding: "16px 16px 18px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Location fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "4px",
                    fontWeight: 500,
                  }}
                >
                  城市（必填）
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                >
                  <option value="">請選擇城市</option>
                  {REPORT_CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {CITY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "4px",
                    fontWeight: 500,
                  }}
                >
                  地區（選填）
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="例如：信義區 / 北區"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>

            {/* Clinic name */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                診所 / 醫院 / 藥局名稱（必填）
              </label>
              <input
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="請填寫官方名稱，以方便其他人辨識"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Type buttons */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                類型（必選）
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {REPORT_TYPE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`filter-btn ${type === t ? "active" : ""}`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Price fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "4px",
                    fontWeight: 500,
                  }}
                >
                  5mg 價格（元）
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={price5mg}
                  onChange={(e) => setPrice5mg(e.target.value)}
                  placeholder=""
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                  min={1000}
                  max={13000}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginBottom: "4px",
                    fontWeight: 500,
                  }}
                >
                  10mg 價格（元）
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={price10mg}
                  onChange={(e) => setPrice10mg(e.target.value)}
                  placeholder=""
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                  min={1000}
                  max={16000}
                />
              </div>
            </div>

            {/* Note */}
            <div style={{ marginBottom: "14px" }}>
              <label
                style={{
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                備註（選填）
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：需先看診、會推銷醫美、排隊人多、醫師很細心…"
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Email (optional) */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "13px",
                  display: "block",
                  marginBottom: "4px",
                  fontWeight: 500,
                }}
              >
                Email（選填）
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="如果願意，填寫 email 方便必要時聯絡你（不會公開）"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Messages */}
            {errorMsg && (
              <p
                style={{
                  color: "#b91c1c",
                  fontSize: "13px",
                  marginBottom: "8px",
                  lineHeight: 1.4,
                }}
              >
                {errorMsg}
              </p>
            )}
            {successMsg && (
              <p
                style={{
                  color: "#166534",
                  fontSize: "13px",
                  marginBottom: "8px",
                  lineHeight: 1.4,
                }}
              >
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: submitting ? "#9ca3af" : "#4f46e5",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: submitting ? "default" : "pointer",
              }}
            >
              {submitting ? "送出中…" : "送出價格回報"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportPriceFormPage;
