import type { Metadata } from "next";
import { TrackFaultContent } from "./TrackFaultContent";

export const metadata: Metadata = {
  title: "Track Your Report",
  description: "Track the status of your fault report",
};

export default function TrackFaultPage() {
  return <TrackFaultContent />;
}
