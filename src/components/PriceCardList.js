// src/components/PriceCardList.js
import React from "react";
import { CITY_LABELS, TYPE_LABELS } from "../data/prices";
import { FaRegEdit } from "react-icons/fa";
import { getCanonicalTypeCode, formatPrice } from "../utils/priceHelpers";
import { DOSE_COLUMNS, COMMON_DOSES } from "../utils/doseConfig";

function PriceCardList({ data, showAllDoses, onOpenReport }) {
  const activeDoseColumns = showAllDoses
    ? DOSE_COLUMNS
    : DOSE_COLUMNS.filter((d) => COMMON_DOSES.includes(d.label));

  return (
    <section className="card-list">
      {data.map((item, index) => {
        const typeCode = getCanonicalTypeCode(item.type);
        const note = item.note || "";

        return (
          <article
            key={`${item.id}-${index}-card`}
            className="clinic-card"
            id={`card-${item.id}`}
          >
            {/* ---------- Header ---------- */}
            <div className="clinic-card-header">
              <div className="clinic-name">{item.clinic || "未命名診所"}</div>
              <div className="clinic-meta">
                <span>{CITY_LABELS[item.city] || item.city || "-"}</span>
                {item.district && <span> · {item.district}</span>}
                <span> · {TYPE_LABELS[typeCode] || "診所"}</span>
              </div>
            </div>

            {/* ---------- Price section ---------- */}
            <div className="clinic-prices">
              {showAllDoses ? (
                <div className="dose-grid">
                  {DOSE_COLUMNS.map((dose) => {
                    const display = formatPrice(item[dose.key]);
                    if (!display) return null;
                    return (
                      <span key={dose.key} className="price-box">
                        {dose.label}：{display}
                      </span>
                    );
                  })}
                </div>
              ) : (
                activeDoseColumns.map((dose) => {
                  const display = formatPrice(item[dose.key]);
                  if (!display) return null;
                  return (
                    <span key={dose.key} className="price-box">
                      {dose.label}：{display}
                    </span>
                  );
                })
              )}
            </div>

            {/* ---------- Note section ---------- */}
            {note && (
              <div className="clinic-note">
                <div className="note-text">{note}</div>
              </div>
            )}

            {/* ---------- Footer row (updated date + edit button) ---------- */}
            <div className="clinic-footer-row">
              {/* Updated date (left side) */}
              {item.last_updated && (
                <span className="updated-date">
                  更新日期：{item.last_updated}
                </span>
              )}

              {/* Edit button (right side) */}
              <button
                type="button"
                className="clinic-edit-btn"
                onClick={() => onOpenReport(item)}
              >
                <FaRegEdit className="clinic-edit-icon" />
                <span>協助更新</span>
              </button>
            </div>
          </article>
        );
      })}

      {data.length === 0 && (
        <p className="status-text">目前沒有符合條件的資料。</p>
      )}
    </section>
  );
}

export default PriceCardList;
