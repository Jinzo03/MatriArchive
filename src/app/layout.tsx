import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Matriarchal Shari'ah",
  description: "Connected universe dashboard for lore, stories, and navigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}