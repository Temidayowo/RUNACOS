import type { Metadata } from "next";
import { ArticleDetailContent } from "./ArticleDetailContent";

export const metadata: Metadata = { title: "Article" };

export default function ArticleDetailPage() {
  return <ArticleDetailContent />;
}
