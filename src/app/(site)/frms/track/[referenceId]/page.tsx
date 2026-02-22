import type { Metadata } from "next";
import { TrackResultContent } from "./TrackResultContent";

export const metadata: Metadata = { title: "Fault Report Status" };

export default function TrackResultPage() {
  return <TrackResultContent />;
}
