// @ts-nocheck
"use client";
import React from "react";

export function Footer() {
  return (
    <footer style={{ background: "var(--surface-container-low)", marginTop: "6rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 3rem 2rem", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: "3rem" }}>
        <div>
          <span style={{ fontSize: "1rem", fontWeight: 800, background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>The Editorial Architect</span>
          <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>Curating high-end opportunities for the world's most discerning editorial and creative professionals.</p>
        </div>
        {[["Platform", ["About Us", "Contact Support", "Newsletter"]], ["Legal", ["Privacy Policy", "Terms of Service"]]].map(([title, links]) => (
          <div key={title}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "1rem" }}>{title}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {links.map(l => <li key={l}><a href="#" style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem" }}>Subscribe</h4>
          <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", marginBottom: "1rem" }}>Join our weekly curated digest of new jobs.</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="email" placeholder="Email address" style={{
              flex: 1, padding: "0.5rem 0.875rem", borderRadius: "var(--r-md)",
              background: "var(--surface-container-lowest)", border: "none", outline: "none",
              fontSize: "0.8125rem", fontFamily: "var(--font-body)", color: "var(--on-surface)",
              boxShadow: "0 0 0 1px rgba(194,198,216,.35)",
            }} />
            <button style={{
              width: 38, height: 38, borderRadius: "var(--r-md)", flexShrink: 0,
              background: "linear-gradient(135deg,var(--primary),var(--primary-container))",
              color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}><i className="ms" style={{ fontSize: 18 }}>send</i></button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(194,198,216,.25)" }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>© 2024 The Editorial Architect. All rights reserved.</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          {["share", "language"].map(icon => (
            <button key={icon} style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-surface-variant)", cursor: "pointer" }}>
              <i className="ms" style={{ fontSize: 19 }}>{icon}</i>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
