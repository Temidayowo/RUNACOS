import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
