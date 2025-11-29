// src/pages/HealthPage.js
import React from "react";
import healthSections from "../data/healthSections.json";

function HealthPage() {
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 6 }}>
        和猛健樂有關的基礎健康知識
      </h1>

      <p
        style={{
          fontSize: 13,
          color: "#4b5563",
          marginBottom: 12,
        }}
      >
        以下內容是針對一般成人的基本健康與飲食觀念整理，實際情況仍會因人而異。
        若有慢性病、特殊用藥或其他疑慮，請務必與醫師或營養師討論。
      </p>

      {/* 警語框 */}
      <div
        style={{
          marginBottom: 16,
          padding: "10px 14px",
          borderRadius: 8,
          background: "#fef3c7",
          border: "1px solid #facc15",
          fontSize: 14,
          lineHeight: 1.6,
          color: "#92400e",
        }}
      >
        ⚠️
        警語：以下僅供無特殊疾病需求的人參考，若有特殊需求請以醫師、營養師為主。
        本頁內容為一般健康資訊，並不構成醫療或營養處方。
      </div>

      {healthSections.map((section) => (
        <div key={section.title} style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 18,
              marginBottom: 8,
              borderLeft: "4px solid #0f766e",
              paddingLeft: 8,
            }}
          >
            {section.title}
          </h2>

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
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 500,
                  listStyle: "none",
                }}
              >
                {item.q}
              </summary>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#374151",
                  whiteSpace: "pre-line", // 保留換行
                  lineHeight: 1.7,
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
          marginTop: 8,
          fontSize: 13,
          color: "#6b7280",
          lineHeight: 1.7,
        }}
      >
        本人非營養學專業，以上內容多為一般健康概念整理，可能有不足或錯誤之處，歡迎指正。
        若有慢性病、正在用藥或特殊狀況，請務必與醫師、營養師討論後再做調整。
      </p>
    </div>
  );
}

export default HealthPage;
