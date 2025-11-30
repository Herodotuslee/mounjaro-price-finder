// src/pages/HealthPage.js
import React from "react";
import healthSections from "../data/healthSections.json";

function HealthPage() {
  // RPG-like quest color styles for the first three sections
  const questColors = [
    {
      // Main quest - orange
      bg: "#fff7ed",
      text: "#b45309",
      border: "#f97316",
    },
    {
      // Long-term challenge - blue
      bg: "#eff6ff",
      text: "#1e40af",
      border: "#3b82f6",
    },
    {
      // Advanced training - purple
      bg: "#faf5ff",
      text: "#6b21a8",
      border: "#a855f7",
    },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <header className="page-header">
        <h1 className="page-title">猛健樂健康任務指南</h1>
        <p className="page-subtitle">
          以下整理一些常見的健康任務與建議，幫助你在使用猛健樂的過程中達成最佳效果。
        </p>
      </header>

      {/* Global warning banner */}
      <div className="info-banner info-banner-warning">
        ⚠️
        警語：以下僅供無特殊疾病需求的人參考，若有特殊需求請以醫師、營養師為主。
        本頁內容為一般健康資訊，並不構成醫療或營養處方。
      </div>

      {/* Sections from JSON */}
      {healthSections.map((section, index) => {
        const isQuest = index < 3;

        // Base style for all section titles
        const baseTitleStyle = {
          fontSize: 18,
          marginBottom: 8,
        };

        // Default style for normal sections (non-quest)
        let titleStyle = {
          ...baseTitleStyle,
          borderLeft: "4px solid #0f766e",
          paddingLeft: 8,
          color: "#0f172a",
          fontWeight: 600,
        };

        // Override style for first three sections with RPG quest colors
        if (isQuest) {
          const colorSet = questColors[index];

          titleStyle = {
            ...baseTitleStyle,
            background: colorSet.bg,
            color: colorSet.text,
            borderLeft: `4px solid ${colorSet.border}`,
            padding: "6px 8px",
            borderRadius: 6,
            fontWeight: 700,
          };
        }

        return (
          <div key={section.title} style={{ marginBottom: 24 }}>
            <h2 style={titleStyle}>{section.title}</h2>

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
                    whiteSpace: "pre-line", // keep line breaks from JSON
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        );
      })}

      {/* Footer note */}
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
