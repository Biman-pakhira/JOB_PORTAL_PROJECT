// @ts-nocheck
import type { Metadata } from "next";
import "./globals.css";
import { TOKENS } from "../constants/tokens";
import { DataProvider } from "../context/DataContext";
import { NavWrapper } from "../components/NavWrapper";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "The Editorial Architect | High-Impact Job Portal",
  description: "Curated shortlist of high-impact opportunities in publishing and policy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body>
        <style>{TOKENS}</style>
        <DataProvider>
          <NavWrapper />
          <div style={{ minHeight: "calc(100vh - 64px)" }}>
            {children}
          </div>
          <FooterWrapper />
        </DataProvider>
      </body>
    </html>
  );
}

// Simple wrappers to handle conditional rendering if needed
function FooterWrapper() {
  return <Footer />;
}
