// src/components/ThreadsEmbed.js
import React, { useEffect, useRef } from "react";

/**
 * Props:
 * - embedHtml: 從 Threads「Get embed code」得到的整段 HTML 字串
 */
function ThreadsEmbed({ embedHtml }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !embedHtml) return;

    // 清空舊內容
    el.innerHTML = "";

    // 用 <template> 解析 HTML，保留 script
    const template = document.createElement("template");
    template.innerHTML = embedHtml.trim();

    const nodes = Array.from(template.content.childNodes);

    nodes.forEach((node) => {
      // 需要特別處理 <script> 才會真的執行
      if (node.tagName === "SCRIPT") {
        const script = document.createElement("script");

        // 複製所有 attributes（例如 src, async）
        if (node.attributes) {
          Array.from(node.attributes).forEach((attr) => {
            script.setAttribute(attr.name, attr.value);
          });
        }

        // 若有 inline script 也一併複製
        script.text = node.textContent;

        el.appendChild(script);
      } else {
        el.appendChild(node);
      }
    });
  }, [embedHtml]);

  return (
    <div
      className="threads-embed-container"
      ref={containerRef}
      style={{
        maxWidth: "540px",
        margin: "0 auto 24px",
      }}
    />
  );
}

export default ThreadsEmbed;
