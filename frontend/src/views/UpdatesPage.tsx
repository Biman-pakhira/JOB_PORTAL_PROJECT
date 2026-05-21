// @ts-nocheck

import React from "react";
import { UpdateCard } from "../components/UpdateCard";

export function UpdatesPage({ updates }: any) {
  const safeUpdates = Array.isArray(updates) ? updates : [];
  return (
    <main style={{ paddingTop: 88, paddingBottom: "5rem" }}>
      <header className="fade-up" style={{ padding: "3.5rem 3rem 2.5rem", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.25rem 0.875rem", background: "rgba(0,109,67,.08)",
          borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--secondary)", marginBottom: "1.25rem",
        }}>
          <i className="ms" style={{ fontSize: 14 }}>rss_feed</i> Platform Updates
        </div>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
          Latest <span style={{ background: "linear-gradient(135deg,var(--secondary) 0%,#00a064 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>News & Updates</span>
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--on-surface-variant)", maxWidth: 520, lineHeight: 1.7 }}>
          Stay informed about new features, partnerships, and editorial insights from the platform.
        </p>
      </header>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 3rem" }}>
        {updates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--on-surface-variant)" }}>No updates yet. Check back soon.</div>
        ) : (
          updates.map((u, i) => <UpdateCard key={u.id} update={u} delay={i * 0.08} />)
        )}
      </div>
    </main>
  );
}
