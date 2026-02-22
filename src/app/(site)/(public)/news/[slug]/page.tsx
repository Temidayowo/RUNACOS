import type { Metadata } from "next";
import { NewsDetailContent } from "./NewsDetailContent";

export const metadata: Metadata = { title: "News Article" };

export default function NewsDetailPage() {
  return <NewsDetailContent />;
}
