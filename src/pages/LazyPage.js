// src/pages/LazyPage.js
import React from "react";

function LazyPage() {
  const pageRootStyle = {
    padding: "20px",
    maxWidth: 960,
    margin: "0 auto",
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    marginBottom: 24,
    border: "1px solid #e5e7eb",
  };

  const imageStyle = {
    display: "block",
    width: "100%",
    height: "auto",
  };

  return (
    <div style={pageRootStyle}>
      {/* Shared page header */}
      <header className="page-header">
        <h1 className="page-title">猛健樂購買指南與使用懶人包</h1>
        <p className="page-subtitle">
          這是最精簡的懶人包。第一張圖若是研究清楚相較於完全沒做功課的人，能幫你一個月省約數千到一萬多元。用藥時把第二張圖的重點放在心理，如果都能做到你的減重過程會比99%人更健康順利。至於自己的BMR是多少可以參考Inbody或是輸入詳細資料問GPT估計。
        </p>
      </header>
      {/* Card 1: Buying guide */}
      <article style={cardStyle}>
        <img
          src="/image/buying.jpg"
          alt="猛健樂購買指南懶人包"
          style={imageStyle}
        />
      </article>

      {/* Card 2: Using / injection guide */}
      <article style={cardStyle}>
        <img
          src="/image/using.png"
          alt="猛健樂使用方式懶人包"
          style={imageStyle}
        />
      </article>
    </div>
  );
}

export default LazyPage;
