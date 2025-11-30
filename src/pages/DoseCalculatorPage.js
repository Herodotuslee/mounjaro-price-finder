// src/pages/DoseCalculatorPage.js
import React, { useState } from "react";
import text from "../data/texts.json";

const PEN_OPTIONS = [2.5, 5, 7.5, 10, 12.5, 15];

function DoseCalculatorPage() {
  const [penStrength, setPenStrength] = useState(10); // mg
  const [dose, setDose] = useState(5); // mg
  const [clicks, setClicks] = useState(null);
  const [totalUses, setTotalUses] = useState(null);

  const handleDoseInput = (value) => {
    const num = Number(value);
    if (num <= 0 || Number.isNaN(num)) {
      setDose("");
      return;
    }
    const safeValue = Math.min(num, penStrength);
    setDose(safeValue);
  };

  const calculate = () => {
    if (!penStrength || !dose) return;

    // 劑量 → 格數（60 格）
    const raw = (dose * 60) / penStrength;
    const rounded = Math.round(raw);

    // 一支筆總實際可分裝量：劑型 * 4
    const totalAvailable = penStrength * 4;
    const uses = Math.floor(totalAvailable / dose);

    setClicks(rounded);
    setTotalUses(uses);
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        劑量計算器
      </h1>

      <label style={{ fontSize: 14, fontWeight: 600 }}>
        請選擇您購買的劑型 (mg)
      </label>
      <select
        value={penStrength}
        onChange={(e) => {
          const newStrength = Number(e.target.value);
          setPenStrength(newStrength);
          if (dose > newStrength) setDose(newStrength);
        }}
        style={{
          width: "100%",
          padding: 8,
          margin: "6px 0 16px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      >
        {PEN_OPTIONS.map((mg) => (
          <option key={mg} value={mg}>
            {mg} mg
          </option>
        ))}
      </select>

      {/* 單次施打劑量 */}
      <label style={{ fontSize: 14, fontWeight: 600 }}>
        每次想使用的劑量 (mg)
      </label>
      <input
        type="number"
        min="0"
        step="0.1"
        value={dose}
        onChange={(e) => handleDoseInput(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          margin: "6px 0 16px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      {/* 計算按鈕 */}
      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          background: "#0f766e",
          color: "white",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          marginTop: 10,
        }}
      >
        計算
      </button>

      {/* 結果 */}
      {clicks !== null && (
        <>
          <div
            style={{
              marginTop: 20,
              padding: 18,
              background: "#f0fdfa",
              border: "1px solid '#99f6e4'",
              borderRadius: 10,
              textAlign: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            請轉 <span style={{ color: "#0f766e" }}>{clicks}</span> 格
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              background: "#fefce8",
              border: "1px solid #fde047",
              borderRadius: 10,
              textAlign: "center",
              fontSize: 16,
              fontWeight: 600,
              lineHeight: 1.6,
            }}
          >
            一支 全新的 {penStrength} mg 的筆
            <br />
            可施打 <span style={{ color: "#ca8a04" }}>{totalUses}</span> 次{" "}
            {dose} mg
          </div>
        </>
      )}

      <div className="info-banner warning-block" style={{ marginTop: 24 }}>
        {text.expiredWarning}
      </div>
    </div>
  );
}

export default DoseCalculatorPage;
