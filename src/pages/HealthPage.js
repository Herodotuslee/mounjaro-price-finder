// src/pages/HealthPage.js
import React from "react";

function HealthPage() {
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        和猛健樂有關的基礎健康知識
      </h1>

      {/* 警語 */}
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

      <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 12 }}>
        📌 下面每個都很重要，能做到當然最好。但是無法每個都達到沒關係，
        可以依照重要程度慢慢努力。
      </p>

      {/* 主線基礎任務 */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>
          最好達到的重要主線基礎任務
        </h2>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>
            ✅ <strong>每天吃到 BMR 基礎代謝，蛋白質吃足量</strong>
            <br />
            施打猛健樂期間，通常建議蛋白質攝取量約為
            <strong>體重的 1.5 倍（g）</strong>，以降低流失肌肉的風險。
          </li>
          <li>
            ✅ <strong>水要喝足夠，至少「體重 × 30 ml」</strong>
            <br />
            充足水分有利於減脂。例：60kg 至少約{" "}
            <strong>60 × 30 = 1800 ml</strong>。
          </li>
          <li>
            ✅ <strong>睡飽睡好</strong>
            <br />
            睡眠品質對減脂與增肌「超級超級重要」。如果你長期睡不好，建議先想辦法改善睡眠。
          </li>
        </ul>
      </section>

      {/* 次要但長期可以努力的方向 */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>
          不一定要馬上做到，但長期可以努力的方向
        </h2>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>✅ 盡量多吃原型食物。</li>
          <li>✅ 盡量少吃高度加工食品。</li>
          <li>✅ 注意每日總糖分攝取量。</li>
        </ul>
      </section>

      {/* 進階目標 */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>
          進階目標（可以慢慢補強）
        </h2>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>✅ 營養要均衡，不是只看熱量或蛋白質。</li>
          <li>✅ 纖維素攝取足夠，有助於腸道健康與飽足感。</li>
          <li>✅ 一天建議攝取約兩份水果。</li>
        </ul>
      </section>

      {/* BMR 說明 */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>
          📘 什麼是基礎代謝率 BMR（Basal Metabolic Rate）？
        </h2>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>
            ➤ 指的是你<strong>一整天躺著、什麼都不做</strong>
            時，身體仍然會消耗的熱量。
          </li>
          <li>
            ➤ 建議施打猛健樂期間，<strong>每天至少吃到自己的 BMR 熱量</strong>，
            避免吃得過少導致肌肉大量流失、代謝下降。
          </li>
        </ul>
      </section>

      {/* 避免掉肌肉 */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>💪 要如何避免掉肌肉？</h2>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>➤ 規律運動（尤其是阻力訓練／重量訓練）。</li>
          <li>
            ➤ 盡量每天吃到身體所需的蛋白質：
            <strong>約為 1～2 倍體重（g）</strong>，依運動量調整。
          </li>
          <li>➤ 若有腎臟相關問題，蛋白質攝取請先與醫師討論。</li>
        </ul>
      </section>

      {/* 水果會不會胖 */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>🍎 吃水果會胖嗎？</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          ➤ 一般正常份量的水果，<strong>通常不是造成肥胖的主因</strong>。
          真正需要注意的，往往是：
        </p>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>含糖飲料、珍珠奶茶等高糖飲品。</li>
          <li>餅乾、蛋糕、點心、炸物等高熱量加工食品。</li>
          <li>把大量水果打成果汁、每天喝很多的狀況。</li>
        </ul>
        <p style={{ fontSize: 14, lineHeight: 1.7, marginTop: 4 }}>
          ➤ 如果有疑慮，可以實際比較：
          「一杯含糖飲料的糖量」和「同樣熱量水果」的差異，通常會發現加工飲品的負擔更大。
        </p>
      </section>

      {/* 避免停藥後復胖 */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 6 }}>
          🔁 如何避免停藥後復胖？
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
          ➤ 關鍵是在打猛健樂的這段期間，就
          <strong>開始練習未來可以長期維持的生活型態</strong>，
          而不是只把它當成「短期撐一下」的減重工具。
        </p>
        <ul style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          <li>趁這段時間建立穩定、可持續的飲食習慣。</li>
          <li>盡量改善睡眠品質，讓身體在比較健康的狀態下運作。</li>
          <li>從完全久坐的生活，慢慢往「多活動一點」的生活型態前進。</li>
        </ul>
      </section>

      {/* 自我聲明 */}
      <section>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
          本人非營養學專業，以上內容多為一般健康概念整理，若有任何錯誤歡迎指正；
          若有慢性病、正在用藥或特殊狀況，請務必與醫師、營養師討論後再做調整。
        </p>
      </section>
    </div>
  );
}

export default HealthPage;
