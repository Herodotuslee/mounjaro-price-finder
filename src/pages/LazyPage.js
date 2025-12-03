// src/pages/LazyPage.js
import React from "react";
import "../styles/LazyPage.css";
import "../styles/PricePage.css"; // 引入主主題變數

function LazyPage() {
  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* --- Header --- */}
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-icon">📖</span> 新手懶人包
          </h1>
          <p className="page-subtitle-text">
            這是最精簡的攻略指南。
            <br />
            第一張圖能幫你省下不少錢（約數千到一萬多元）；
            <br />
            第二張圖則是健康減重的關鍵心法，跟著做能比 99% 的人更順利喔！
          </p>
        </header>

        {/* --- Card 1: Buying Guide --- */}
        {/* 移除 rotate class，保持端正 */}
        <article className="lazy-card">
          {/* 紙膠帶裝飾保留，作為視覺點綴 */}
          <div className="tape-strip"></div>

          <div className="lazy-card-content">
            <h2 className="lazy-card-title title-buying">🛒 購買指南</h2>
            <img
              src="/image/buying.jpg"
              alt="猛健樂購買指南懶人包"
              className="lazy-image"
            />
          </div>
        </article>

        {/* --- Card 2: Using Guide --- */}
        <article className="lazy-card">
          <div className="tape-strip"></div>

          <div className="lazy-card-content">
            <h2 className="lazy-card-title title-using">💉 使用攻略</h2>
            <img
              src="/image/using.png"
              alt="猛健樂使用方式懶人包"
              className="lazy-image"
            />
            <p className="lazy-note">
              💡 BMR (基礎代謝率) 可以參考 Inbody 機器測量，或是問問 GPT
              幫你估算喔！
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default LazyPage;
