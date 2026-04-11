"use client";
import React from "react";
import { SectorPage } from "../../views/SectorPage";
import { useData } from "../../context/DataContext";

export default function BrowsePage() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading jobs...</p>
      </main>
    );
  }

  return (
    <SectorPage 
      title="All Jobs" 
      subtitle="Explore the full directory of private and government opportunities." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
    />
  );
}
