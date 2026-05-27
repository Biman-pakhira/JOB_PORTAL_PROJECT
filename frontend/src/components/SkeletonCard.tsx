import React from "react";

export function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--r-lg)",
        padding: "1.25rem",
        border: "1px solid rgba(194,198,216,0.25)",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        .sk-block {
          background: linear-gradient(90deg, #e8eaf0 25%, #d0d3e0 50%, #e8eaf0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          border-radius: 6px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        {/* Logo placeholder */}
        <div className="sk-block" style={{ width: 48, height: 48, borderRadius: "12px", flexShrink: 0 }} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {/* Title */}
          <div className="sk-block" style={{ height: 18, width: "65%" }} />
          {/* Company */}
          <div className="sk-block" style={{ height: 14, width: "45%" }} />
          {/* Tags row */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <div className="sk-block" style={{ height: 24, width: 80, borderRadius: 20 }} />
            <div className="sk-block" style={{ height: 24, width: 64, borderRadius: 20 }} />
            <div className="sk-block" style={{ height: 24, width: 72, borderRadius: 20 }} />
          </div>
        </div>

        {/* Bookmark btn */}
        <div className="sk-block" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
