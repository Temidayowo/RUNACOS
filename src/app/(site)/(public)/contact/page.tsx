import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with RUNACOS - We'd love to hear from you",
};

export default function ContactPage() {
  return <ContactContent />;
}
