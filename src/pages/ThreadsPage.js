// src/pages/ThreadsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import LoadingIndicator from "../components/LoadingIndicator";
import useIsMobile from "../hooks/useIsMobile"; // 🆕 import

function ThreadsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const navigate = useNavigate();
  const isMobile = useIsMobile(640); // 🆕 detect mobile

  // Load articles from Supabase
  useEffect(() => {
    const loadData = async () => {
      const url =
        `${SUPABASE_URL}/rest/v1/health_articles` +
        "?select=id,title,description,url,doctor_name,doctor_title,category,created_at,note,health_article_tags(health_tags(name))" +
        "&order=created_at.desc";

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data = await res.json();
      setPosts(data);
      setLoading(false);
    };

    loadData();
  }, []);

  // Toggle open/close for a single article
  const toggleOpen = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Normalize tags
  const postsWithTags = posts.map((post) => ({
    ...post,
    tags: post.health_article_tags?.map((t) => t.health_tags?.name) || [],
  }));

  const allTags = Array.from(
    new Set(
      postsWithTags.flatMap((p) => p.tags).filter((tag) => tag && tag.trim())
    )
  ).sort();

  const filteredPosts =
    selectedTag == null
      ? postsWithTags
      : postsWithTags.filter((post) => post.tags.includes(selectedTag));

  // ---------- Shared page styles (responsive tweaks) ----------
  const pageRootStyle = {
    padding: isMobile ? 16 : 20,
    maxWidth: 960,
    margin: "0 auto",
  };

  const cardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: isMobile ? 10 : 12,
    marginBottom: 12,
    background: "#ffffff",
  };

  const tagFilterContainerStyle = {
    marginBottom: isMobile ? 14 : 18,
    padding: isMobile ? 8 : 10,
    borderRadius: 10,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  };

  // pills smaller on mobile
  const tagChipBaseStyle = {
    borderRadius: 999,
    fontSize: isMobile ? 11 : 12,
    padding: isMobile ? "3px 8px" : "4px 10px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const smallPillButtonBase = {
    fontSize: isMobile ? 12 : 12,
    padding: isMobile ? "4px 8px" : "4px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#4b5563",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.15s ease",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };

  return (
    <div style={pageRootStyle}>
      {/* Page header */}
      <header className="page-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            精選衛教筆記
          </h1>

          {/* Right-side action buttons */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {/* Advanced pharmacology */}
            <button
              type="button"
              onClick={() => navigate("/advanced")}
              style={smallPillButtonBase}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.color = "#374151";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.color = "#4b5563";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              進階藥理知識
            </button>

            {/* Notion nutrition notes */}
            <a
              href="https://sunny-hourglass-05c.notion.site/2ba7da0c290680248b66d644b0d9d910"
              target="_blank"
              rel="noopener noreferrer"
              style={smallPillButtonBase}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
                e.currentTarget.style.color = "#374151";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.color = "#4b5563";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              營養師諮詢筆記
            </a>
          </div>
        </div>

        <p className="page-subtitle" style={{ marginTop: 6 }}>
          精選優秀醫師們的猛健樂相關衛教文章，點標題展開內容。
        </p>
      </header>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div style={tagFilterContainerStyle}>
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            依標籤瀏覽文章：
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isMobile ? 6 : 8, // 🆕 tighter gap on mobile
            }}
          >
            {/* "All" tag */}
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              style={{
                ...tagChipBaseStyle,
                border: "1px solid #2563eb",
                background: selectedTag == null ? "#2563eb" : "#eff6ff",
                color: selectedTag == null ? "#ffffff" : "#1d4ed8",
                fontWeight: 600,
                boxShadow:
                  selectedTag == null
                    ? "0 0 0 1px rgba(37, 99, 235, 0.35)"
                    : "none",
              }}
            >
              全部
            </button>

            {/* Individual tags */}
            {allTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag((prev) => (prev === tag ? null : tag))
                  }
                  style={{
                    ...tagChipBaseStyle,
                    border: "1px solid",
                    borderColor: isActive ? "#16a34a" : "#d1d5db",
                    background: isActive ? "#dcfce7" : "#ffffff",
                    color: isActive ? "#166534" : "#374151",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading && <LoadingIndicator centered={true} />}

      {!loading && filteredPosts.length === 0 && (
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          沒有符合這個標籤的文章。
        </p>
      )}

      {/* Article cards */}
      {filteredPosts.map((post) => {
        const isOpen = openId === String(post.id);

        return (
          <article key={post.id} style={cardStyle}>
            <button
              type="button"
              onClick={() => toggleOpen(String(post.id))}
              style={{
                display: "flex",
                width: "100%",
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                    color: "#111827",
                  }}
                >
                  {post.title}
                </h2>

                {post.category && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      background: "#f3f4f6",
                      borderRadius: 999,
                      marginTop: 4,
                      display: "inline-block",
                    }}
                  >
                    {post.category}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: 18,
                  color: "#9ca3af",
                  marginLeft: 8,
                }}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div style={{ marginTop: 10 }}>
                {post.note && (
                  <div
                    style={{
                      padding: "10px 12px",
                      background: "#f9fafb",
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                        color: "#374151",
                      }}
                    >
                      {post.note}
                    </div>
                  </div>
                )}

                {post.description && (
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                      marginBottom: 10,
                      color: "#374151",
                    }}
                  >
                    {post.description}
                  </p>
                )}

                {post.tags.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: "inline-block",
                          fontSize: 12,
                          padding: "2px 8px",
                          background: "#ecfdf5",
                          color: "#047857",
                          borderRadius: 999,
                          marginRight: 6,
                          marginBottom: 4,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {post.url && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 12,
                    }}
                  >
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        fontSize: 12,
                        textDecoration: "none",
                        padding: "5px 10px",
                        borderRadius: 999,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        color: "#374151",
                      }}
                    >
                      查看原文 ↗
                    </a>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}

      <p className="threads-disclaimer">
        本站整理之衛教內容係擷取自網路上醫師或專業醫療人員公開之衛教文章，並經本人統整、節錄與改寫後再行刊登，且皆附上原始出處連結。若您為原作者且不希望內容被引用或節錄，敬請來信告知，將盡速協助下架或調整。
      </p>
    </div>
  );
}

export default ThreadsPage;
