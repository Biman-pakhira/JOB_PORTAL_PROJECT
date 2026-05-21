import React from "react";
import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    { label: "HOME", icon: "home", href: "/" },
    { label: "BROWSE", icon: "search", href: "/browse" },
    { label: "SAVED", icon: "bookmark", href: "/saved" },
    { label: "PROFILE", icon: "person", href: "/profile" }
  ];

  return (
    <nav className="mobile-show-flex" style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#ffffff", borderTop: "1px solid var(--outline-variant)",
      padding: "0.75rem var(--content-pad)",
      display: "none", justifyContent: "space-between", alignItems: "center",
      zIndex: 100, height: 72,
      boxShadow: "0 -4px 12px rgba(0,0,0,0.03)"
    }}>
      {navItems.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} to={item.href} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem",
            color: isActive ? "var(--primary)" : "var(--on-surface-variant)",
            textDecoration: "none", minWidth: 64, transition: "color 0.2s"
          }}>
            <i className={`ms ${isActive ? "ms-fill" : ""}`} style={{ fontSize: 24 }}>{item.icon}</i>
            <span style={{ fontSize: "0.625rem", fontWeight:isActive ? 800 : 600, letterSpacing: "0.02em" }}>{item.label || (item as any).navigation}</span>
          </Link>
        );
      })}
    </nav>
  );
}
