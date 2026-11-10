import type { Metadata } from "next";
import { DareSite } from "@/components/dare/site";

export const metadata: Metadata = {
  title: "Dare 210",
  description: "7 easy Dare videos a day for 30 days: Dare's formats, step-by-step scripts, a playable library of viral videos and analytics.",
  // a personal playbook with campaign briefs in it: keep it out of search engines
  robots: { index: false, follow: false },
};

export default function DareLayout({ children }: { children: React.ReactNode }) {
  return <DareSite>{children}</DareSite>;
}
