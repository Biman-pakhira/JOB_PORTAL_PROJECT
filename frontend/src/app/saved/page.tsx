"use client";
import React from "react";
import { SectorPage } from "../../views/SectorPage";
import { useData } from "../../context/DataContext";

export default function SavedPage() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  const savedJobs = jobs.filter((j: any) => bookmarks.has(j.id));

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading bookmarks...</p>
      </main>
    );
  }

  return (
    <SectorPage 
      title="Saved Jobs" 
      subtitle="Your personal shortlist of bookmarked opportunities." 
      jobs={savedJobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
    />
  );
}
