"use client";
import React from "react";
import { SectorPage } from "../../views/SectorPage";
import { useData } from "../../context/DataContext";

export default function GovtJobsPage() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) return <main style={{ paddingTop: 88, textAlign: "center" }}><p>Loading...</p></main>;

  return (
    <SectorPage 
      title="Govt Jobs" 
      subtitle="Curated roles in policy writing, communications, and public sector editorial." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
      categoryFilter="Govt" 
    />
  );
}
