// @ts-nocheck
"use client";
import React, { useState } from "react";
import { JobCard } from "../components/JobCard";

export function SectorPage({ title, subtitle, jobs, bookmarks, onBookmark, categoryFilter = null as string | null }: any) {
  const [activeChip, setActiveChip] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const chips = ["All", "Full-time", "Contract", "Remote", "On-site", "Hybrid"];

  // Safety check for jobs array
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  // Filter by category first (case-insensitive)
  let filtered = categoryFilter 
    ? safeJobs.filter((j: any) => j.category?.toLowerCase() === categoryFilter.toLowerCase())
    : safeJobs;

  // Filter by search query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(j => 
        j.title?.toLowerCase().includes(q) || 
        j.company?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
    );
  }

  // Then filter by chip
  filtered = activeChip === "All" ? filtered
    : filtered.filter(j => j.type === activeChip || j.location?.toLowerCase().includes(activeChip.toLowerCase()));

  const deadlineSoon = [...filtered]
    .sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 3);

  const urgencyColor = { critical: "var(--error)", warning: "var(--tertiary)", safe: "var(--secondary)" };

  return (
    <main style={{ paddingTop: 88, paddingBottom: "5rem" }}>
      {/* Hero */}
      <header className="fade-up page-header">
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.25rem 0.875rem", background: "rgba(0,80,203,.08)",
          borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "1.25rem",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", animation: "pulse 2s infinite" }} />
          {categoryFilter || "All"} Opportunities
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
          {title} <span style={{ background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Shortlist.</span>
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "var(--on-surface-variant)", maxWidth: 540, lineHeight: 1.7 }}>
          {subtitle}
        </p>
      </header>

      {/* Bento Layout */}
      <div className="responsive-grid" style={{ padding: "0 var(--content-pad)", maxWidth: 1280, margin: "0 auto", alignItems: "start" }}>

        {/* Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Deadline Widget */}
          <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
             <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Closing Soon</h2>
             {deadlineSoon.map(j => (
               <div key={j.id} style={{
                 background: "var(--surface-container-lowest)", borderRadius: "var(--r-md)",
                 padding: "0.875rem", marginBottom: "0.5rem", borderLeft: "3px solid var(--tertiary)"
               }}>
                 <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>{j.title}</div>
                 <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>{j.company}</div>
               </div>
             ))}
          </div>

          {/* Filters */}
          <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: "0.75rem" }}>Filter by type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {chips.map(c => (
                <button key={c} onClick={() => setActiveChip(c)} style={{
                  padding: "0.3125rem 0.875rem", borderRadius: "var(--r-full)",
                  fontSize: "0.8125rem", fontWeight: 600,
                  background: activeChip === c ? "var(--primary)" : "var(--surface-container-high)",
                  color: activeChip === c ? "white" : "var(--on-surface-variant)",
                  transition: "background .18s,color .18s", cursor: "pointer",
                }}>{c}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Job Panel */}
        <section>
          <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid var(--outline-variant)" }}>
              <i className="ms" style={{ color: "var(--primary)" }}>search</i>
              <input 
                type="text" 
                placeholder="Search by role, company, or keywords..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ 
                    flex: 1, background: "none", border: "none", outline: "none", 
                    fontSize: "0.9375rem", fontWeight: 500, color: "var(--on-surface)" 
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ color: "var(--on-surface-variant)", opacity: 0.6 }}>
                   <i className="ms" style={{ fontSize: 18 }}>close</i>
                </button>
              )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Available Openings</h2>
              <span style={{ padding: "0 0.5rem", background: "var(--surface-container-high)", borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700 }}>{filtered.length}</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)" }}>No jobs match this filter.</div>
          ) : (
            filtered.map((job, i) => (
              <JobCard key={job.id} job={job} bookmarked={bookmarks.has(job.id)} onBookmark={onBookmark} delay={i * 0.08} />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
