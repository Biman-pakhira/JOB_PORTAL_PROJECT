import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Editorial Architect | Job Portal",
  description: "Curating high-end opportunities for editorial and creative professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
