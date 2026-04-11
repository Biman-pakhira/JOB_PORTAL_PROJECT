"use client";
import React from "react";
import Link from "next/link";

export function Nav({ activePage, user, onLogout, isAdmin }: any) {
  const links = [
    { label: "Browse Jobs", href: "/" },
    { label: "Private Sector", href: "/private-sector" },
    { label: "Govt Jobs", href: "/govt-jobs" },
    { label: "Updates", href: "/updates" }
  ];

  const currentRoute = activePage === "browse-jobs" ? "/" : "/" + activePage;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 3rem", height: 64,
      background: "rgba(250,248,255,0.82)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(194,198,216,0.20)",
    }}>
      <Link href="/" style={{
        fontFamily: "var(--font-headline)", fontSize: "1.15rem", fontWeight: 800,
        letterSpacing: "-0.03em",
        background: "linear-gradient(135deg,#0050cb 0%,#0066ff 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", cursor: "pointer",
        textDecoration: "none"
      }}>The Editorial Architect</Link>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            style={{
              fontSize: "0.875rem", fontWeight: currentRoute === l.href ? 700 : 500,
              color: currentRoute === l.href ? "var(--primary)" : "var(--on-surface-variant)",
              position: "relative", transition: "color 0.2s",
              textDecoration: "none"
            }}>
            {l.label}
            {currentRoute === l.href && (
              <span style={{
                position: "absolute", bottom: -4, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg,var(--primary),var(--primary-container))",
                borderRadius: 2,
              }} />
            )}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {user || isAdmin ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
             {user && <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>Hi, {user.name.split(" ")[0]}</span>}
             {isAdmin && <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)" }}>Admin Session</span>}
             <button onClick={onLogout} style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--error)", background: "transparent", border: "none", cursor: "pointer" }}>Sign Out</button>
          </div>
        ) : (
          <Link href="/auth" style={{
            padding: "0.5rem 1.25rem", borderRadius: "var(--r-md)",
            fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface-variant)",
            transition: "color 0.2s", cursor: "pointer",
            textDecoration: "none"
          }}>Login</Link>
        )}
        <Link href="/admin" style={{
          padding: "0.5rem 1.375rem", borderRadius: "var(--r-md)",
          fontSize: "0.875rem", fontWeight: 700, color: "var(--on-primary)",
          background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)",
          boxShadow: "0 4px 16px rgba(0,80,203,.25)", transition: "transform .15s,box-shadow .2s",
          cursor: "pointer",
          textDecoration: "none"
        }}>Admin Panel</Link>
      </div>
    </nav>
  );
}
