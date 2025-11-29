// src/components/Footer.js
import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Donate 區塊 */}
        <div className="footer-donate-card">
          <h3 className="footer-donate-title">小額贊助：支持網站繼續更新</h3>
          <p className="footer-donate-text">
            這個網站目前沒有廣告、沒有業配，如果這份整理讓你少踩了一些雷、少花一點智商稅，
            也歡迎小額請我喝杯咖啡，讓我有動力持續更新價格與功能。
          </p>
          <a
            href="https://buymeacoffee.com/holaalbertc"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-donate-button"
          >
            ☕ 請我喝杯咖啡
          </a>

          <p className="footer-donate-note">
            每一杯咖啡，都是開發的一小步。真的非常感謝你的支持！
          </p>
        </div>

        {/* 關於本站 */}
        <div className="footer-main">
          <h2 className="footer-title">關於這個網站</h2>
          <p className="footer-text">
            我在找猛健樂價格時發現資訊非常不透明。 第一次買 5 mg
            猛健樂花了15000元，也聽過朋友去醫美買了一支 5 mg+智商稅產品 付到
            32000 元。於是決定把全台診所與醫療院所的價格集中整理起來，
            讓大家可以更快找到合理的價格與適合的醫師。
          </p>
          <p className="footer-text footer-text-sub">
            這裡的內容完全由群友們自發整理，僅供參考，不提供醫療診斷或治療建議；
            所有用藥與治療決策，仍請務必與合格醫師詳細討論。
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-bottom-text">
          © {new Date().getFullYear()} 台灣猛健樂資訊網 。
        </span>
      </div>
    </footer>
  );
}

export default Footer;
