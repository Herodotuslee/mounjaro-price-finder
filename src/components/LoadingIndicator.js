// src/components/LoadingIndicator.js
import React from "react";
import "../styles/loading.css";

/**
 * Reusable loading indicator for all pages.
 *
 * Props:
 * - message: string (optional): text shown next to spinner
 * - centered: boolean (optional): center the loader in the page
 * - size: "sm" | "md" (optional): spinner size
 */
function LoadingIndicator({
  message = "載入中⋯⋯",
  centered = false,
  size = "md",
}) {
  const rootClass = centered
    ? "loading-root loading-root-centered"
    : "loading-root";

  const spinnerClass =
    size === "sm" ? "loading-spinner loading-spinner-sm" : "loading-spinner";

  return (
    <div className={rootClass}>
      <div className={spinnerClass} />
      <div className="loading-text">{message}</div>
    </div>
  );
}

export default LoadingIndicator;
