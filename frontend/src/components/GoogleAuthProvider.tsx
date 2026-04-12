"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  // Use client ID from environment or a placeholder
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "123456789-placeholder.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
