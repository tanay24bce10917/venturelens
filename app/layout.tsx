import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VentureLens — Turn problems into opportunities",
  description: "AI-inspired business opportunity discovery and validation platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}