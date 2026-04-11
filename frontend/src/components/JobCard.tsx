import React, { useState } from "react";
import Link from "next/link";

export function JobCard({ job, bookmarked, onBookmark, delay = 0 }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className={`fade-up`}
        style={{
          background: "#ffffff",
          borderRadius: "var(--r-xl)", padding: "1.25rem",
          display: "flex", gap: "1rem", alignItems: "center",
          transition: "transform .2s, box-shadow .2s",
          marginBottom: "1rem", cursor: "pointer",
          boxShadow: hovered ? "0 12px 24px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.02)",
          transform: hovered ? "translateY(-2px)" : "none",
          animationDelay: `${delay}s`,
          position: "relative"
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Logo / Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: "var(--r-lg)",
          background: (job.logoColor || "var(--primary)") + "15",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: job.logoColor || "var(--primary)", fontWeight: 800, fontSize: "1.25rem",
          flexShrink: 0
        }}>
          {job.logo || (job.company || "JB").slice(0, 2).toUpperCase()}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

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
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); job.url && window.open(job.url, '_blank') }}
              style={{
              padding: "0.5rem 1.375rem", borderRadius: "var(--r-md)", fontSize: "0.8125rem", fontWeight: 700,
              color: "var(--on-secondary)", background: "var(--secondary)",
              boxShadow: "0 2px 8px rgba(0,109,67,.20)", transition: "background .18s,transform .15s",
              whiteSpace: "nowrap", flexShrink: 0,
            }}>Apply Now</button>
          </div>
        </div>
      </article>
    </Link>
  );
}
