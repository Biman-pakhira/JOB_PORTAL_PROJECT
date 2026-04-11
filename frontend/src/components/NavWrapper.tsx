"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { useData } from "../context/DataContext";

export function NavWrapper() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useData();
  
  // Map pathname to activePage
  const activePage = pathname === "/" ? "browse-jobs" : pathname.replace("/", "");

  return <Nav activePage={activePage} user={user} onLogout={logout} isAdmin={isAdmin} />;
}
