import React from "react";
import FAQ_SECTIONS from "../data/faq.json";

function FaqPage() {
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1>猛健樂常見問題</h1>
      <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16 }}>
        以下內容僅供一般資訊參考，實際用藥與風險評估請務必諮詢合格醫師，本頁面不提供醫療建議。
      </p>

      {FAQ_SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>{section.title}</h2>
          {section.items.map((item, idx) => (
            <details
              key={idx}
              style={{
                marginBottom: 8,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                padding: "8px 12px",
                background: "#ffffff",
              }}
            >
              <summary style={{ cursor: "pointer", fontWeight: 500 }}>
                {item.q}
              </summary>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#374151",
                  whiteSpace: "pre-line",
                }}
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>
      ))}

      <p
        style={{
          marginTop: 24,
          fontSize: 13,
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        ⚠️ 以上內容僅供參考，非醫療建議。
        任何與健康或用藥相關問題，請務必諮詢合格醫師。
      </p>
      <p>v1.1.1</p>
    </div>
  );
}

export default FaqPage;
