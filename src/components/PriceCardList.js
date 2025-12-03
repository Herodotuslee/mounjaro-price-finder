// src/components/PriceCardList.js
import React from "react";
import "../styles/PricePage.css";

function PriceCardList({ data, showAllDoses, onOpenReport }) {
  if (!data || data.length === 0) {
    return (
      <div className="no-data-card">
        <p>找不到符合的資料...</p>
      </div>
    );
  }

  return (
    <div className="card-list">
      {data.map((row) => (
        <div className="clinic-card" key={row.id}>
          {/* Header */}
          <div className="clinic-header">
            <div className="clinic-name">{row.clinic}</div>
            <div className="clinic-meta">
              {row.city} {row.district && `· ${row.district}`} ·{" "}
              {row.type === "hospital"
                ? "醫院"
                : row.type === "pharmacy"
                ? "藥局"
                : "診所"}
            </div>
          </div>

          {/* Prices Grid */}
          <div className="clinic-prices">
            {/* 💡 修改這裡：增加 > 0 的判斷，過濾掉價格為 0 或 null 的項目 */}
            {showAllDoses ? (
              // 顯示所有劑量
              <>
                {row.price2_5mg > 0 && (
                  <div className="price-box">2.5mg : {row.price2_5mg}</div>
                )}
                {row.price5mg > 0 && (
                  <div className="price-box">5mg : {row.price5mg}</div>
                )}
                {row.price7_5mg > 0 && (
                  <div className="price-box">7.5mg : {row.price7_5mg}</div>
                )}
                {row.price10mg > 0 && (
                  <div className="price-box">10mg : {row.price10mg}</div>
                )}
                {row.price12_5mg > 0 && (
                  <div className="price-box">12.5mg : {row.price12_5mg}</div>
                )}
                {row.price15mg > 0 && (
                  <div className="price-box">15mg : {row.price15mg}</div>
                )}
              </>
            ) : (
              // 只顯示常見劑量
              <>
                {row.price5mg > 0 && (
                  <div className="price-box">5mg : {row.price5mg}</div>
                )}
                {row.price10mg > 0 && (
                  <div className="price-box">10mg : {row.price10mg}</div>
                )}
              </>
            )}
          </div>

          {/* Notes */}
          {row.note && (
            <div className="clinic-note">
              <span className="note-icon">📝</span> {row.note}
            </div>
          )}

          {/* Footer: Date (Left) and Button (Right) */}
          <div className="clinic-footer">
            <div className="updated-date">
              {row.last_updated ? `更新於: ${row.last_updated}` : ""}
            </div>

            <button
              className="clinic-edit-btn"
              onClick={() => onOpenReport(row)}
            >
              <span className="edit-icon">✎</span> 協助更新
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PriceCardList;
