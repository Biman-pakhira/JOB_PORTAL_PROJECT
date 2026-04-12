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
    <>
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
          onClick={() => setMenuOpen(true)}
          style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}>
          <i className="ms" style={{ fontSize: 28, color: "var(--on-surface)" }}>menu</i>
        </button>

        <Link href="/" style={{
          display: "flex", alignItems: "center", textDecoration: "none"
        }}>
          <img src="/logo.png" alt="Jobs Today" style={{ height: 180, width: "auto" }} />
        </Link>
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
          {activePage !== "auth" && (
            <>
              {(user?.id || isAdmin) ? (
                <button onClick={onLogout} style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--error)" }}>Sign Out</button>
              ) : (
                <Link href="/auth" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>Login</Link>
              )}
              {isAdmin && (
                <Link href="/admin" style={{
                  padding: "0.5rem 1.125rem", borderRadius: "var(--r-md)",
                  fontSize: "0.8125rem", fontWeight: 700, color: "var(--on-primary)",
                  background: "var(--primary)"
                }}>Admin</Link>
              )}
            </>
          )}
        </div>

        {/* Profile / Avatar */}
        <Link href={user ? "/profile" : "/auth"} style={{
          width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--surface-container-high)", border: "1.5px solid var(--primary)33"
        }}>
          {user ? (
            user.profileImage ? (
              <img src={user.profileImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Me" />
            ) : (
              <i className="ms" style={{ fontSize: 20, color: "var(--primary)" }}>person</i>
            )
          ) : isAdmin ? (
            <i className="ms" style={{ fontSize: 20, color: "var(--primary)" }}>admin_panel_settings</i>
          ) : (
            <i className="ms" style={{ fontSize: 20, color: "var(--primary)" }}>person</i>
          )}
        </Link>
      </div>
    </nav>

      {/* Mobile Drawer (Full Screen) */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "#ffffff", zIndex: 9999, display: "flex", flexDirection: "column",
          overflowY: "auto", animation: "fadeUp 0.2s ease-out"
        }}>
          {/* Close Button Top Right */}
          <div style={{ padding: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setMenuOpen(false)} style={{
              width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", border: "none", cursor: "pointer"
            }}>
              <i className="ms" style={{ fontSize: 28, color: "#1a1a1a" }}>close</i>
            </button>
          </div>

          {/* Navigation Section */}
          <div style={{ fontSize: "0.875rem", color: "#727687", padding: "0 1.5rem 0.5rem" }}>Navigation</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                style={{
                  padding: "1.125rem 1.5rem", borderBottom: "1px solid #e8e8e8", borderTop: l === links[0] ? "1px solid #e8e8e8" : "none",
                  fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", textDecoration: "none", 
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                {l.label}
                <i className="ms" style={{ fontSize: 22, color: "#1a1a1a" }}>chevron_right</i>
              </Link>
            ))}
          </div>

          {/* Account Section */}
          {activePage !== "auth" && (
            <>
              <div style={{ fontSize: "0.875rem", color: "#727687", padding: "2rem 1.5rem 0.5rem" }}>Account</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {user?.id || isAdmin ? (
                  <>
                    <div style={{
                      padding: "1.125rem 1.5rem", borderBottom: "1px solid #e8e8e8", borderTop: "1px solid #e8e8e8",
                      fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", display: "flex", justifyContent: "space-between"
                    }}>
                      Signed in as {isAdmin ? "Admin" : user?.name}
                    </div>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                        padding: "1.125rem 1.5rem", borderBottom: "1px solid #e8e8e8",
                        fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", textDecoration: "none", display: "flex", justifyContent: "space-between"
                      }}>
                        Admin Panel
                        <i className="ms" style={{ fontSize: 22, color: "#1a1a1a" }}>chevron_right</i>
                      </Link>
                    )}
                    <button onClick={() => { onLogout(); setMenuOpen(false); window.location.href = '/'; }} style={{
                      padding: "1.125rem 1.5rem", border: "none", borderBottom: "1px solid #e8e8e8",
                      fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", display: "flex", justifyContent: "space-between",
                      background: "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit"
                    }}>
                      Sign Out
                      <i className="ms" style={{ fontSize: 22, color: "#1a1a1a" }}>chevron_right</i>
                    </button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setMenuOpen(false)} style={{
                    padding: "1.125rem 1.5rem", borderBottom: "1px solid #e8e8e8", borderTop: "1px solid #e8e8e8",
                    fontSize: "1rem", fontWeight: 700, color: "#1a1a1a", textDecoration: "none", display: "flex", justifyContent: "space-between"
                  }}>
                    Login to Account
                    <i className="ms" style={{ fontSize: 22, color: "#1a1a1a" }}>chevron_right</i>
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
