import type { Metadata } from "next";
import { ExecutivesContent } from "./ExecutivesContent";

export const metadata: Metadata = {
  title: "Executive Council",
  description: "Meet the RUNACOS Executive Council members",
};

export default function ExecutivesPage() {
  return <ExecutivesContent />;
}
