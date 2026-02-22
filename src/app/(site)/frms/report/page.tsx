import type { Metadata } from "next";
import { ReportFaultContent } from "./ReportFaultContent";

export const metadata: Metadata = {
  title: "Report a Fault",
  description: "Submit a fault report through the RUNACOS Fault Reporting & Management System",
};

export default function ReportFaultPage() {
  return <ReportFaultContent />;
}
