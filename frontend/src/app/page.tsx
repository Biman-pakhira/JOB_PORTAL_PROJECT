"use client";
import React from "react";
import { SectorPage } from "../views/SectorPage";
import { useData } from "../context/DataContext";

export default function Home() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) {
    return (
      <main style={{ paddingTop: 88, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading curated opportunities...</p>
      </main>
    );
  }

  return (
    <SectorPage 
      title="All Opportunities" 
      subtitle="Your curated shortlist of high-impact opportunities, ranked by editorial priority." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
    />
  );
}
