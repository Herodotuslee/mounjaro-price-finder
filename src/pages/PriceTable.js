// src/components/PriceTable.js
import React from "react";
import "../styles/PricePage.css"; // Ensure styling

function PriceTable({ data, showAllDoses, onOpenReport }) {
  if (!data || data.length === 0) {
    return (
      <div className="table-card">
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "var(--ac-brown)",
          }}
        >
          沒有找到符合的資料...
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="price-table">
          <thead>
            <tr>
              <th>地區</th>
              <th>名稱</th>
              {showAllDoses ? (
                <>
                  <th>2.5mg</th>
                  <th>5mg</th>
                  <th>7.5mg</th>
                  <th>10mg</th>
                  <th>12.5mg</th>
                  <th>15mg</th>
                </>
              ) : (
                <>
                  <th>5mg</th>
                  <th>10mg</th>
                </>
              )}
              <th>備註</th>
              <th>更新</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {/* City / District */}
                <td className="col-city">
                  <div style={{ fontWeight: "700" }}>{row.city}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {row.district}
                  </div>
                </td>

                {/* Name */}
                <td className="col-clinic">
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>
                    {row.clinic}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {row.type === "hospital"
                      ? "醫院"
                      : row.type === "pharmacy"
                      ? "藥局"
                      : "診所"}
                  </div>
                </td>

                {/* Prices */}
                {showAllDoses ? (
                  <>
                    <td>{row.price2_5mg ? row.price2_5mg : "-"}</td>
                    <td>{row.price5mg ? row.price5mg : "-"}</td>
                    <td>{row.price7_5mg ? row.price7_5mg : "-"}</td>
                    <td>{row.price10mg ? row.price10mg : "-"}</td>
                    <td>{row.price12_5mg ? row.price12_5mg : "-"}</td>
                    <td>{row.price15mg ? row.price15mg : "-"}</td>
                  </>
                ) : (
                  <>
                    <td
                      style={{
                        fontWeight: "700",
                        color: "var(--ac-green-dark)",
                      }}
                    >
                      {row.price5mg ? row.price5mg : "-"}
                    </td>
                    <td
                      style={{
                        fontWeight: "700",
                        color: "var(--ac-green-dark)",
                      }}
                    >
                      {row.price10mg ? row.price10mg : "-"}
                    </td>
                  </>
                )}

                {/* Note (Simplified: Direct Render) */}
                <td className="col-note">{row.note ? row.note : ""}</td>

                {/* Update Action */}
                <td>
                  <button
                    className="report-icon-btn"
                    onClick={() => onOpenReport(row)}
                    title="協助更新價格"
                  >
                    ✎
                  </button>
                  {row.last_updated && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        marginTop: "4px",
                      }}
                    >
                      {row.last_updated}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PriceTable;
