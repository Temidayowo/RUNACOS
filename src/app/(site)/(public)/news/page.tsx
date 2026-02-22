import type { Metadata } from "next";
import { NewsContent } from "./NewsContent";

export const metadata: Metadata = {
  title: "News & Announcements",
  description: "Stay informed with the latest news from RUNACOS",
};

export default function NewsPage() {
  return <NewsContent />;
}
