// src/components/PriceReportModal.js
import React, { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { CITY_LABELS, TYPE_LABELS } from "../data/prices";
import "../styles/PriceReportModal.css";
// Convert empty string to number or null
const toNullableInt = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

function PriceReportModal({ target, onClose }) {
  // Local editable fields
  const [district, setDistrict] = useState("");
  const [price2_5, setPrice2_5] = useState("");
  const [price5, setPrice5] = useState("");
  const [price7_5, setPrice7_5] = useState("");
  const [price10, setPrice10] = useState("");
  const [price12_5, setPrice12_5] = useState("");
  const [price15, setPrice15] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // refill when target changes
  useEffect(() => {
    if (!target) return;
    setDistrict(target.district ?? "");
    setPrice2_5(target.price2_5mg ?? "");
    setPrice5(target.price5mg ?? "");
    setPrice7_5(target.price7_5mg ?? "");
    setPrice10(target.price10mg ?? "");
    setPrice12_5(target.price12_5mg ?? "");
    setPrice15(target.price15mg ?? "");
    setNote(target.note ?? "");
    setError(null);
    setSubmitting(false);
  }, [target]);

  if (!target) return null;

  const cityLabel = CITY_LABELS[target.city] || target.city || "-";
  const typeLabel =
    TYPE_LABELS[
      (target.type || "").toString().trim().toLowerCase() || "clinic"
    ] || "診所";

  // click backdrop = close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !submitting) onClose();
  };

  // Submit update to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // require at least one price
    if (
      !price2_5 &&
      !price5 &&
      !price7_5 &&
      !price10 &&
      !price12_5 &&
      !price15
    ) {
      setError("請至少填寫一個劑量的價格。");
      return;
    }

    try {
      setSubmitting(true);

      const url = `${SUPABASE_URL}/rest/v1/mounjaro_reports`;

      const body = {
        city: target.city,
        district: district || target.district || null,
        clinic: target.clinic,
        type: target.type || "clinic",
        is_cosmetic: target.is_cosmetic ?? false,

        price2_5mg: toNullableInt(price2_5),
        price5mg: toNullableInt(price5),
        price7_5mg: toNullableInt(price7_5),
        price10mg: toNullableInt(price10),
        price12_5mg: toNullableInt(price12_5),
        price15mg: toNullableInt(price15),

        note: note || null,
        last_updated: new Date().toISOString().slice(0, 10),
        status: "pending",
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

      alert("已送出協助更新，感謝你幫忙維護價格資料！");
      onClose();
    } catch (err) {
      console.error("❌ 協助更新送出失敗：", err);
      setError("送出失敗，請稍後再試。如果持續發生，請聯絡站長。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        <h2 className="modal-title">協助更新價格資料</h2>
        {/* Low-key clinic info line */}
        <p
          style={{
            marginTop: "4px",
            marginBottom: "14px",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          {cityLabel} / {target.district || "-"} / {target.clinic}（{typeLabel}
          ）
        </p>

        {/* ---------------- Form ---------------- */}
        <form onSubmit={handleSubmit}>
          {/* District */}
          <div className="modal-row-2">
            <div className="modal-field">
              <label className="modal-label">地區（選填）</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="modal-input"
              />
            </div>
          </div>

          {/* Price Section Title */}
          <div className="modal-dose-header">
            <span className="modal-label">
              價格（單次金額，NT$ 新台幣，至少填一格）
            </span>
          </div>

          {/* Price Grid */}
          <div className="modal-grid">
            {[
              ["2.5 mg", price2_5, setPrice2_5],
              ["5 mg", price5, setPrice5],
              ["7.5 mg", price7_5, setPrice7_5],
              ["10 mg", price10, setPrice10],
              ["12.5 mg", price12_5, setPrice12_5],
              ["15 mg", price15, setPrice15],
            ].map(([label, value, setter], idx) => (
              <div className="modal-field dose-field" key={idx}>
                <label className="modal-label">{label}</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      marginRight: "6px",
                      color: "#475569",
                      fontSize: "13px",
                    }}
                  >
                    NT$
                  </span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="modal-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="modal-field">
            <label className="modal-label">備註（選填）</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="modal-textarea"
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              取消
            </button>

            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "提交中…" : "提交協助更新"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PriceReportModal;
