import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "UGC creator dashboard (free template)",
  description: "A free dashboard template for UGC creators: campaigns, ideation, film, editing, scheduler, variations, accounts and tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
