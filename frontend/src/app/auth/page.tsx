"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { AuthView } from "../../views/AuthView";
import { useData } from "../../context/DataContext";

export default function AuthRoute() {
  const router = useRouter();
  const { setUser } = useData();

  return (
    <AuthView 
      onAuthSuccess={(u: any) => { 
        setUser(u); 
        router.push("/"); 
      }} 
      onBack={() => router.push("/")} 
    />
  );
}
