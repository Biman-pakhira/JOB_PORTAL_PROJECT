import React from "react";
import { useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { useData } from "../context/DataContext";

export function NavWrapper() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout, isAdmin } = useData();
  
  // Map pathname to activePage
  const activePage = pathname === "/" ? "browse-jobs" : pathname.replace("/", "");

  return <Nav activePage={activePage} user={user} onLogout={logout} isAdmin={isAdmin} />;
}
