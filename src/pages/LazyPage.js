// src/pages/LazyPage.js
import React from "react";

function LazyPage() {
  return (
    <div style={{ padding: "20px" }}>
      <img
        src="/image/buying.jpg"
        alt="懶人包 1"
        style={{ width: "100%", borderRadius: "12px" }}
      />

      <img
        src="/image/using.png"
        alt="懶人包 2"
        style={{ width: "100%", borderRadius: "12px" }}
      />
    </div>
  );
}

export default LazyPage;
