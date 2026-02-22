import type { Metadata } from "next";
import { EventsContent } from "./EventsContent";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming RUNACOS events and workshops",
};

export default function EventsPage() {
  return <EventsContent />;
}
