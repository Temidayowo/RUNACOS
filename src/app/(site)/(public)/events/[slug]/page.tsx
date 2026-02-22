import type { Metadata } from "next";
import { EventDetailContent } from "./EventDetailContent";

export const metadata: Metadata = { title: "Event Details" };

export default function EventDetailPage() {
  return <EventDetailContent />;
}
