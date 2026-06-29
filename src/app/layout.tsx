import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenHW - Liberate Your Hardware",
  description: "Community platform for hardware liberation guides",
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
