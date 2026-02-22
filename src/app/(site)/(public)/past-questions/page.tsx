import type { Metadata } from "next";
import { PastQuestionsContent } from "./PastQuestionsContent";

export const metadata: Metadata = {
  title: "Past Questions",
  description: "Access previous exam questions and study materials",
};

export default function PastQuestionsPage() {
  return <PastQuestionsContent />;
}
