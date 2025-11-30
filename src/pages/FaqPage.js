// src/pages/FaqPage.js
import React, { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import texts from "../data/texts.json";
function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFaq() {
      try {
        setLoading(true);
        setError(null);

        const url = `${SUPABASE_URL}/rest/v1/mounjaro_faq?select=*&order=item_order.asc`;

        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error("❌ FAQ 載入失敗：", err);
        setError("無法載入 FAQ，請稍後再試。");
      } finally {
        setLoading(false);
      }
    }

    loadFaq();
  }, []);

  if (loading) return <p></p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <header className="page-header">
        <h1 className="page-title">猛健樂常見問題</h1>
        <p className="page-subtitle">
          這裡整理網友最常問的問題，方便快速查詢。
        </p>
      </header>
      <div className="info-banner info-banner-warning">
        {texts.generalWarning}
      </div>

      {faqs.map((item) => (
        <details
          key={item.id}
          style={{
            marginBottom: 12,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            {item.question}
          </summary>

          <p
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#374151",
              whiteSpace: "pre-line",
              lineHeight: 1.7,
            }}
          >
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}

export default FaqPage;
