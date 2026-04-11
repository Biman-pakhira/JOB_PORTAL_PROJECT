"use client";
import React from "react";
import { UpdatesPage } from "../../views/UpdatesPage";
import { useData } from "../../context/DataContext";

export default function UpdatesRoute() {
  const { updates, loading } = useData();
  if (loading) return <main style={{ paddingTop: 88, textAlign: "center" }}><p>Loading updates...</p></main>;
  return <UpdatesPage updates={updates} />;
}
