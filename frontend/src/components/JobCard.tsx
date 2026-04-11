// @ts-nocheck
import React, { useState } from "react";

export function JobCard({ job, bookmarked, onBookmark, delay = 0 }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className={`fade-up`}
      style={{
        background: hovered ? "var(--surface-bright)" : "var(--surface-container-lowest)",
        borderRadius: "var(--r-xl)", padding: "1.625rem",
        display: "flex", gap: "1.25rem",
        transition: "background .2s,transform .2s,box-shadow .2s",
        marginBottom: "1.125rem", cursor: "pointer",
        boxShadow: hovered ? "0 12px 32px var(--shadow)" : job.featured ? "0 2px 12px rgba(0,80,203,.06)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <div style={{
        width: 56, height: 56, flexShrink: 0, borderRadius: "var(--r-lg)",
        background: (job.logoColor || "#0050cb") + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 800,
        color: job.logoColor || "#0050cb",
      }}>{job.logo || (job.company || "JB").slice(0, 2).toUpperCase()}</div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
              <h3 style={{
                fontSize: "1.125rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.25,
                color: hovered ? "var(--primary)" : "var(--on-surface)", transition: "color .18s",
              }}>{job.title}</h3>
              {job.urgent && (
                <span style={{
                  padding: "0.2rem 0.5rem", background: "var(--error-container)", color: "var(--on-error-container)",
                  borderRadius: "var(--r-sm)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                }}>Urgent</span>
              )}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              {job.company} <span style={{ opacity: 0.4 }}>•</span> {job.location}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBookmark(job.id); }}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: bookmarked ? "var(--primary)" : "var(--on-surface-variant)",
              transition: "background .18s", flexShrink: 0,
            }}>
            <i className={`ms ms-fill`} style={{ fontSize: 20, fontVariationSettings: bookmarked ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>
              {bookmarked ? "bookmark" : "bookmark_border"}
            </i>
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.125rem" }}>
          {[job.category, job.type].filter(Boolean).map(t => (
            <span key={t} style={{ padding: "0.25rem 0.75rem", borderRadius: "var(--r-full)", background: "var(--surface-container-high)", color: "var(--on-surface-variant)", fontSize: "0.75rem", fontWeight: 600 }}>{t}</span>
          ))}
          {job.salary && (
            <span style={{ padding: "0.25rem 0.75rem", borderRadius: "var(--r-full)", background: "rgba(0,109,67,0.09)", color: "var(--secondary)", fontSize: "0.75rem", fontWeight: 700 }}>{job.salary}</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(194,198,216,.20)", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
              <i className="ms" style={{ fontSize: 15 }}>schedule</i> {job.postedAgo || "Recently"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: job.urgent ? "var(--tertiary)" : "var(--on-surface-variant)", fontWeight: job.urgent ? 600 : 400 }}>
              <i className="ms" style={{ fontSize: 15 }}>event</i> {job.deadline || "Open"}
            </span>
          </div>
          <button 
            onClick={() => job.url && window.open(job.url, '_blank')}
            style={{
            padding: "0.5rem 1.375rem", borderRadius: "var(--r-md)", fontSize: "0.8125rem", fontWeight: 700,
            color: "var(--on-secondary)", background: "var(--secondary)",
            boxShadow: "0 2px 8px rgba(0,109,67,.20)", transition: "background .18s,transform .15s",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>Apply Now</button>
        </div>
      </div>
    </article>
  );
}
