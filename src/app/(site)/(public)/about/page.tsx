import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about RUNACOS - The Redeemer's University Association of Computer Science Students",
};

export default function AboutPage() {
  return <AboutContent />;
}
