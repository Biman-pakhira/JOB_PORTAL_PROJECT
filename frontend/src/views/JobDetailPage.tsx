// @ts-nocheck
"use client";
import React, { useState } from "react";
import Link from "next/link";

export function JobDetailPage({ job, bookmarked, onBookmark }: any) {
  if (!job) return <div style={{ paddingTop: 120, textAlign: "center" }}>Job not found</div>;

  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Header / Hero */}
      <header style={{ paddingTop: 100, paddingBottom: "3rem", background: "var(--surface-container-low)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
             <div style={{
                width: 48, height: 48, borderRadius: "var(--r-md)",
                background: (job.logoColor || "var(--primary)") + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: job.logoColor || "var(--primary)", fontWeight: 800
             }}>
                {job.logo || (job.company || "JB").slice(0, 2).toUpperCase()}
             </div>
             <span style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.08em" }}>
                {job.company}
             </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
                {job.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", color: "var(--on-surface-variant)", fontSize: "0.9375rem", fontWeight: 500 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ms" style={{ fontSize: 18 }}>location_on</i> {job.location}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ms" style={{ fontSize: 18 }}>work</i> {job.type}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><i className="ms" style={{ fontSize: 18 }}>payments</i> {job.salary || "Competitive"}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
               <button 
                onClick={() => onBookmark(job.id)}
                style={{
                  width: 48, height: 48, borderRadius: "50%", background: bookmarked ? "var(--primary)" : "var(--surface-container-highest)",
                  color: bookmarked ? "white" : "var(--on-surface)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s"
                }}>
                 <i className={`ms ${bookmarked ? "ms-fill" : ""}`}>{bookmarked ? "bookmark" : "bookmark_border"}</i>
               </button>
               <button style={{
                  width: 48, height: 48, borderRadius: "50%", background: "var(--surface-container-highest)",
                  color: "var(--on-surface)", display: "flex", alignItems: "center", justifyContent: "center"
               }}>
                 <i className="ms">share</i>
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <div style={{ maxWidth: 1200, margin: "-1.5rem auto 0", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem", position: "relative" }}>
        
        {/* Main Content */}
        <section>
          {/* Urgency Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, #e65100 0%, #bf360c 100%)", 
            borderRadius: "var(--r-md)", padding: "1.25rem 1.5rem", color: "white",
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem",
            boxShadow: "0 8px 24px rgba(191,54,12,0.15)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
               <i className="ms" style={{ fontSize: 24, animation: "pulse 2.5s infinite" }}>alarm_on</i>
               <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.8 }}>Application Window Closing</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800 }}>Ends soon</div>
               </div>
            </div>
            <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", opacity: 0.8 }}>Deadline</div>
                <div style={{ fontSize: "1rem", fontWeight: 800 }}>{job.deadline || "TBA"}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
            {/* Description */}
            <article>
               <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 4, height: 24, background: "var(--primary)", borderRadius: 2 }} />
                  Job Description
               </h2>
               <div style={{ color: "var(--on-surface-variant)", lineHeight: 1.8, fontSize: "1.0625rem" }}>
                  {job.description || "No detailed description provided."}
               </div>
               {job.skills && (
                 <div style={{ marginTop: "2rem" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", color: "var(--on-surface)", marginBottom: "1rem" }}>Preferred Skills</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                       {job.skills.split(',').map((s: string) => (
                         <span key={s} style={{ padding: "0.4rem 1rem", background: "var(--surface-container-high)", borderRadius: "var(--r-full)", fontSize: "0.8125rem", fontWeight: 600 }}>
                            {s.trim()}
                         </span>
                       ))}
                    </div>
                 </div>
               )}
            </article>

            {/* Eligibility */}
            <article style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "2.5rem" }}>
               <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem" }}>Eligibility Criteria</h2>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div>
                     <h3 style={{ fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", color: "var(--primary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <i className="ms">school</i> Education & Certifications
                     </h3>
                     <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9375rem", color: "var(--on-surface-variant)" }}>
                        <li style={{ display: "flex", gap: "0.5rem" }}>• Relevant degree in the field</li>
                        <li style={{ display: "flex", gap: "0.5rem" }}>• Professional certifications preferred</li>
                     </ul>
                  </div>
                  <div>
                     <h3 style={{ fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", color: "var(--secondary)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <i className="ms">military_tech</i> Experience Profile
                     </h3>
                     <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9375rem", color: "var(--on-surface-variant)" }}>
                        <li style={{ display: "flex", gap: "0.5rem" }}>• {job.experience || "Minimum 2-3 years of proven experience"}</li>
                        <li style={{ display: "flex", gap: "0.5rem" }}>• Strong track record in similar roles</li>
                     </ul>
                  </div>
               </div>
            </article>

            {/* About Organization */}
            <article>
               <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>About the Organization</h2>
               <img 
                src="/images/office-mockup.png" 
                alt="Office Mockup" 
                style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: "var(--r-xl)", marginBottom: "1.5rem", boxShadow: "0 12px 32px var(--shadow)" }} 
               />
               <p style={{ color: "var(--on-surface-variant)", lineHeight: 1.8, fontSize: "1.0625rem" }}>
                  Working at {job.company} means being part of a team dedicated to excellence. Our culture is built on transparency, innovation, and the relentless pursuit of design excellence that serves the public good.
               </p>
            </article>
          </div>
        </section>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 100, height: "fit-content" }}>
          <div style={{ background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)", padding: "2rem", boxShadow: "0 24px 48px var(--shadow)", border: "1px solid var(--outline-variant)" }}>
            <button 
              onClick={() => job.url && window.open(job.url, '_blank')}
              style={{
                width: "100%", padding: "1.25rem", background: "var(--primary)", color: "white",
                borderRadius: "var(--r-md)", fontSize: "1.125rem", fontWeight: 800, marginBottom: "1rem",
                boxShadow: "0 8px 24px rgba(0,80,203,0.25)", transition: "transform .2s"
              }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Apply Now
            </button>
            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--on-surface-variant)", fontWeight: 500, marginBottom: "2rem" }}>
                Referral bonus of $500 eligible for this role.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
               <div>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Key Timeline</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                     {[["Publication Date", "calendar_today", job.postedAgo || "Recently"], ["Application Deadline", "event_busy", job.deadline || "TBA"], ["Screening", "list_alt", "In Progress"]].map(([lbl, ic, val], i) => (
                       <div key={lbl} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "var(--surface-container-low)", borderRadius: "var(--r-md)" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: i === 1 ? "var(--error)" : "var(--primary)" }}>
                             <i className="ms" style={{ fontSize: 16 }}>{ic}</i>
                          </div>
                          <div>
                             <div style={{ fontSize: "0.625rem", fontWeight: 800, textTransform: "uppercase", opacity: 0.6 }}>{lbl}</div>
                             <div style={{ fontSize: "0.8125rem", fontWeight: 700 }}>{val}</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--outline-variant)" }}>
                  <h4 style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Preparation Resources</h4>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                     {[["Download Selection Criteria PDF", "download"], ["Previous Interview Questions", "history_edu"], ["Application FAQ", "help_outline"]].map(([lbl, ic]) => (
                       <li key={lbl} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                          <i className="ms" style={{ fontSize: 16 }}>{ic}</i> {lbl}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
