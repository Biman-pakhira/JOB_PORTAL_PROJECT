"use client";
import React from "react";
import { HomeView } from "../views/HomeView";
import { useData } from "../context/DataContext";

export default function Home() {
  const { loading } = useData();

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Fetching opportunities...</p>
      </main>
    );
  }

  return <HomeView />;
}
