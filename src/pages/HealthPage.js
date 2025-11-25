// src/pages/HealthPage.js
import React from "react";

const ARTICLES = [
  {
    title: "減重藥物在體重管理中的角色",
    summary:
      "說明為何藥物可以幫助控制食慾、影響飽足感，但仍需要搭配飲食、運動與睡眠。",
    bullets: [
      "藥物主要是幫助控制食慾與飽足感，讓執行飲食計畫變容易。",
      "真正長期維持體重的是生活習慣，而不是單一藥物。",
      "用藥期間依然需要與醫師討論飲食與運動的調整。",
    ],
  },
  {
    title: "用藥期間的飲食觀念",
    summary: "介紹原型食物、蛋白質攝取與水分的重要性，不提供個人化飲食處方。",
    bullets: [
      "每天嘗試安排足量蛋白質，有助於維持肌肉量。",
      "以蔬菜、全穀物與未加工食物為主，減少含糖飲料與高熱量零食。",
      "若有胃部不適或噁心，飲食調整應與醫師或營養師討論。",
    ],
  },
];

function HealthPage() {
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1>與猛健樂相關的健康與營養觀念</h1>
      <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16 }}>
        以下內容為一般健康資訊，並不構成醫療或營養處方，若需個人化建議請諮詢醫師或營養師。
      </p>

      {ARTICLES.map((article) => (
        <div
          key={article.title}
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>{article.title}</h2>
          <p style={{ fontSize: 14, color: "#4b5563", marginBottom: 8 }}>
            {article.summary}
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 14 }}>
            {article.bullets.map((b, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default HealthPage;
