// src/pages/FaqPage.js
import React from "react";

const FAQ_SECTIONS = [
  {
    title: "基本資訊",
    items: [
      {
        q: "什麼是猛健樂？",
        a: "簡單描述它屬於哪類減重用藥，需要醫師處方，不能自行購買或調整。",
      },
      {
        q: "誰適合考慮使用？",
        a: "通常會由醫師根據體重、BMI、代謝狀況與其他疾病評估，並非每個人都適合。",
      },
    ],
  },
  {
    title: "安全與副作用",
    items: [
      {
        q: "常見的副作用有哪些？",
        a: "可能包括噁心、嘔吐、腹瀉或胃部不適等，如有不舒服應與醫師討論，本文不取代醫療建議。",
      },
    ],
  },
];

function FaqPage() {
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1>猛健樂常見問題</h1>
      <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16 }}>
        以下內容僅供一般資訊參考，實際用藥與風險評估請務必諮詢合格醫師。
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
              <div style={{ marginTop: 6, fontSize: 14, color: "#374151" }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FaqPage;
