import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 
                   process.env.VITE_PUBLIC_GOOGLE_CLIENT_ID || 
                   "123456789-placeholder.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
