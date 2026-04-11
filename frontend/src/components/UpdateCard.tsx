// @ts-nocheck
"use client";
import React from "react";

export function UpdateCard({ update, delay = 0 }: any) {
  const colors = { Feature: "var(--primary)", Report: "var(--secondary)", Partnership: "var(--tertiary)" };
  const bgs = { Feature: "rgba(0,80,203,.08)", Report: "rgba(0,109,67,.08)", Partnership: "rgba(159,54,0,.08)" };
  return (
    <div className="fade-up" style={{
      background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)",
      padding: "1.5rem", marginBottom: "1.125rem", animationDelay: `${delay}s`,
      boxShadow: "0 1px 4px var(--shadow)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <span style={{
          padding: "0.2rem 0.7rem", borderRadius: "var(--r-full)",
          background: bgs[update.type] || "var(--surface-container-high)",
          color: colors[update.type] || "var(--on-surface-variant)",
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase",
        }}>{update.type}</span>
        <span style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>{update.date}</span>
      </div>
      <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{update.title}</h3>
      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>{update.body}</p>
    </div>
  );
}
