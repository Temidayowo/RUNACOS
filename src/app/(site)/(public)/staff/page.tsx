import type { Metadata } from "next";
import { StaffContent } from "./StaffContent";

export const metadata: Metadata = {
  title: "Department Staff",
  description: "Meet the academic staff of the Computer Science Department",
};

export default function StaffPage() {
  return <StaffContent />;
}
