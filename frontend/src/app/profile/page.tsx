"use client";
import React from "react";
import { ProfileView } from "../../views/ProfileView";
import { useData } from "../../context/DataContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useData();
  const router = useRouter();

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    router.push("/auth");
    return null;
  }

  return <ProfileView />;
}
