import type { Metadata } from "next";
import { ArticlesContent } from "./ArticlesContent";

export const metadata: Metadata = {
  title: "Articles",
  description: "Read insightful articles from RUNACOS members",
};

export default function ArticlesPage() {
  return <ArticlesContent />;
}
