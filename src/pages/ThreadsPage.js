// src/pages/ThreadsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🆕 新增
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

function ThreadsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null); // 目前選中的標籤
  const navigate = useNavigate(); // 🆕

  useEffect(() => {
    const loadData = async () => {
      const url =
        SUPABASE_URL +
        "/rest/v1/health_articles" +
        "?select=id,title,description,url,doctor_name,doctor_title,category,created_at,note,health_article_tags(health_tags(name))" +
        "&url=ilike.%25threads.com%25" +
        "&order=created_at.desc";

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: "Bearer " + SUPABASE_ANON_KEY,
        },
      });

      const data = await res.json();
      setPosts(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const toggleOpen = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // ---------- 整理 tags ----------
  const postsWithTags = posts.map((post) => ({
    ...post,
    tags: post.health_article_tags?.map((t) => t.health_tags?.name) || [],
  }));

  const allTags = Array.from(
    new Set(
      postsWithTags.flatMap((p) => p.tags).filter((tag) => tag && tag.trim())
    )
  ).sort();

  // 依照選取的標籤過濾文章
  const filteredPosts =
    selectedTag == null
      ? postsWithTags
      : postsWithTags.filter((post) => post.tags.includes(selectedTag));

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: "bold",
            margin: 0,
          }}
        >
          精選衛教文
        </h1>

        {/* 🆕 進階藥理知識按鈕（低存在感版本） */}
        <button
          type="button"
          onClick={() => navigate("/advanced")}
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            color: "#4b5563",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s ease",
          }}
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
          進階藥理知識 →
        </button>
      </div>

      <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16 }}>
        精選與減重、運動、健康知識相關的 網路衛教文章整理，點標題展開內容。
      </p>

      {/* ------- 標籤雲（Tag Cloud） ------- */}
      {allTags.length > 0 && (
        <div
          style={{
            marginBottom: 18,
            padding: 10,
            borderRadius: 10,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            依標籤瀏覽文章：
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              style={{
                borderRadius: 999,
                border: "1px solid #2563eb",
                background: selectedTag == null ? "#2563eb" : "#eff6ff",
                color: selectedTag == null ? "#ffffff" : "#1d4ed8",
                fontSize: 12,
                padding: "4px 12px",
                cursor: "pointer",
                fontWeight: 600,
                boxShadow: selectedTag == null ? "0 0 0 1px #2563eb" : "none",
                transition: "all 0.15s ease",
              }}
            >
              全部
            </button>
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
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: isActive
                      ? "#16a34a"
                      : "rgba(209, 213, 219, 1)",
                    background: isActive ? "#dcfce7" : "#ffffff",
                    color: isActive ? "#166534" : "#374151",
                    fontSize: 12,
                    padding: "4px 10px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading && <p>載入中…</p>}

      {!loading && filteredPosts.length === 0 && (
        <p style={{ fontSize: 13, color: "#6b7280" }}>
          沒有符合這個標籤的文章。
        </p>
      )}

      {filteredPosts.map((post) => {
        const isOpen = openId === post.id;

        return (
          <div
            key={post.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
              background: "#ffffff",
            }}
          >
            {/* clickable 標題 */}
            <button
              onClick={() => toggleOpen(post.id)}
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

            {/* 展開後內容 */}
            {isOpen && (
              <div style={{ marginTop: 10 }}>
                {/* NOTE 小標題摘要 */}
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

                {/* description 正文 */}
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

                {/* tags 顯示在卡片內 */}
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

                {/* Threads 原文按鈕（右下角） */}
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
          </div>
        );
      })}
    </div>
  );
}

export default ThreadsPage;
