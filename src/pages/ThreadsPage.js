// src/pages/ThreadsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import LoadingIndicator from "../components/LoadingIndicator";
import useIsMobile from "../hooks/useIsMobile";
// Import shared theme variables
import "../styles/PricePage.css";
// Import specific threads page styles
import "../styles/ThreadsPage.css";

function ThreadsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const navigate = useNavigate();
  const isMobile = useIsMobile(640);

  // Load articles from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
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

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="price-page-root">
      <div className="price-page-inner">
        {/* --- Header --- */}
        <header className="page-header">
          <div className="threads-header-row">
            <h1 className="page-title">
              <span className="title-icon">📚</span> 精選衛教筆記
            </h1>

            {/* Right-side action buttons */}
            <div className="threads-actions">
              <button
                type="button"
                onClick={() => navigate("/advanced")}
                className="action-pill-btn"
              >
                進階藥理知識
              </button>

              <a
                href="https://sunny-hourglass-05c.notion.site/2ba7da0c290680248b66d644b0d9d910"
                target="_blank"
                rel="noopener noreferrer"
                className="action-pill-btn"
              >
                營養師諮詢筆記
              </a>
            </div>
          </div>

          <p className="page-subtitle-text">
            精選優秀醫師們的猛健樂相關衛教文章，點標題展開內容。
          </p>
        </header>

        {/* --- Tag Filters (Hidden on Mobile) --- */}
        {false && allTags.length > 0 && (
          <div className="tag-filter-container">
            <div className="tag-filter-label">依標籤瀏覽文章：</div>

            <div className="tag-filter-list">
              {/* "All" tag */}
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`tag-chip ${
                  selectedTag == null ? "tag-chip-active" : ""
                }`}
              >
                全部
              </button>

              {/* Individual tags */}
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setSelectedTag((prev) => (prev === tag ? null : tag))
                  }
                  className={`tag-chip ${
                    selectedTag === tag ? "tag-chip-active" : ""
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingIndicator centered={true} />}

        {!loading && filteredPosts.length === 0 && (
          <div className="no-data-card">
            <p>沒有符合這個標籤的文章 HOO...</p>
          </div>
        )}

        {/* --- Article Cards --- */}
        <div className="threads-list">
          {filteredPosts.map((post) => {
            const isOpen = openId === String(post.id);

            return (
              <article
                key={post.id}
                className={`thread-card ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(String(post.id))}
                  className="thread-summary-btn"
                >
                  <div className="thread-header-content">
                    <h2 className="thread-title">{post.title}</h2>

                    {/* Metadata Row */}
                    <div className="thread-meta-row">
                      {post.category && (
                        <span className="thread-category-badge">
                          {post.category}
                        </span>
                      )}

                      {/* Green tag chips */}
                      {post.tags.length > 0 && (
                        <div className="thread-tags-inline">
                          {post.tags.map((tag) => (
                            <span key={tag} className="thread-tag-pill">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`thread-toggle-icon ${isOpen ? "open" : ""}`}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="thread-content-body">
                    {/* Note Box */}
                    {post.note && (
                      <div className="thread-note-box">
                        <span className="note-icon">📝</span>
                        <div className="note-text">{post.note}</div>
                      </div>
                    )}

                    {/* Description */}
                    {post.description && (
                      <p className="thread-description">{post.description}</p>
                    )}

                    {/* Source Link */}
                    {post.url && (
                      <div className="thread-link-row">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="thread-source-btn"
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
        </div>

        {/* --- Disclaimer Footer --- */}
        <div className="threads-footer-note">
          <p>
            本站整理之衛教內容係擷取自網路上醫師或專業醫療人員公開之衛教文章，並經本人統整、節錄與改寫後再行刊登，且皆附上原始出處連結。
            若您為原作者且不希望內容被引用或節錄，敬請來信告知，將盡速協助下架或調整。
          </p>
        </div>
      </div>
    </div>
  );
}

export default ThreadsPage;
