"use client";
import React from "react";
import { SectorPage } from "../../views/SectorPage";
import { useData } from "../../context/DataContext";

export default function PrivateSectorPage() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) return <main style={{ paddingTop: 88, textAlign: "center" }}><p>Loading...</p></main>;

  return (
    <SectorPage 
      title="Private Sector" 
      subtitle="Explore high-impact roles in publishing, tech, and design firms." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
      categoryFilter="Private" 
    />
  );
}
