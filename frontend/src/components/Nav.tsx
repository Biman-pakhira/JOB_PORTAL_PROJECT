"use client";
import React from "react";
import Link from "next/link";

export function Nav({ activePage, user, onLogout, isAdmin }: any) {
  const [menuOpen, setMenuOpen] = React.useState(false);
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
      padding: "0 var(--content-pad)", height: 64,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(194,198,216,0.30)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Mobile Toggle on Left */}
        <button 
          className="mobile-show"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="ms" style={{ fontSize: 24 }}>{menuOpen ? "close" : "menu"}</i>
        </button>

        <Link href="/" style={{
          fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 800,
          color: "var(--primary)", textDecoration: "none"
        }}>Nexus Talent</Link>
      </div>

      {/* Desktop Links (Hidden on Mobile) */}
      <div className="mobile-hide" style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            style={{
              fontSize: "0.875rem", fontWeight: currentRoute === l.href ? 700 : 500,
              color: currentRoute === l.href ? "var(--primary)" : "var(--on-surface-variant)",
              textDecoration: "none"
            }}>
            {l.label}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div className="mobile-hide" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {user || isAdmin ? (
            <button onClick={onLogout} style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--error)" }}>Sign Out</button>
          ) : (
            <Link href="/auth" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>Login</Link>
          )}
          <Link href="/admin" style={{
            padding: "0.5rem 1.125rem", borderRadius: "var(--r-md)",
            fontSize: "0.8125rem", fontWeight: 700, color: "var(--on-primary)",
            background: "var(--primary)"
          }}>Admin</Link>
        </div>

        {/* Profile / Avatar */}
        <Link href={user ? "/profile" : "/auth"} style={{ 
          width: 36, height: 36, borderRadius: "50%", overflow: "hidden", 
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--surface-container-high)", border: "1.5px solid var(--primary)33"
        }}>
          {user?.profileImage ? (
             <img src={user.profileImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Me" />
          ) : (
             <i className="ms" style={{ fontSize: 20, color: "var(--primary)" }}>person</i>
          ) || (isAdmin && <i className="ms" style={{ fontSize: 20, color: "var(--primary)" }}>admin_panel_settings</i>)}
        </Link>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
          background: "#ffffff", zIndex: 100, padding: "2.5rem var(--content-pad)",
          display: "flex", flexDirection: "column", gap: "1.25rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          overflowY: "auto",
          animation: "fadeUp 0.3s ease-out"
        }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--on-surface-variant)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Navigation</div>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ 
                fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em",
                color: currentRoute === l.href ? "var(--primary)" : "var(--on-surface)", 
                textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
              {l.label}
              {currentRoute === l.href && <i className="ms" style={{ fontSize: 24 }}>chevron_right</i>}
            </Link>
          ))}
          
          <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid var(--outline-variant)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {user || isAdmin ? (
               <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                 <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>
                   Signed in as <span style={{ color: "var(--on-surface)", fontWeight: 800 }}>{isAdmin ? "Administrator" : user?.name}</span>
                 </div>
                 <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ 
                   width: "100%", padding: "1rem", borderRadius: "var(--r-md)", 
                   background: "var(--error-container)", color: "var(--on-error-container)", 
                   fontWeight: 800, textAlign: "center" 
                 }}>Sign Out</button>
               </div>
            ) : (
               <Link href="/auth" onClick={() => setMenuOpen(false)} style={{ 
                 width: "100%", padding: "1rem", borderRadius: "var(--r-md)", 
                 background: "var(--surface-container-high)", color: "var(--on-surface)", 
                 fontWeight: 800, textAlign: "center", textDecoration: "none" 
               }}>Login to Account</Link>
            )}
            <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
               width: "100%", padding: "1.125rem", borderRadius: "var(--r-md)", 
               background: "var(--primary)", color: "white", 
               textAlign: "center", fontWeight: 800, textDecoration: "none",
               boxShadow: "0 8px 20px rgba(0,80,203,0.2)"
            }}>Go to Admin Panel</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
