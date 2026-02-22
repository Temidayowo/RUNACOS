import { HeroSection } from "@/components/home/HeroSection";
import { QuickAccessCards } from "@/components/home/QuickAccessCards";
import { LatestNews } from "@/components/home/LatestNews";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { StatsSection } from "@/components/home/StatsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickAccessCards />
      <LatestNews />
      <UpcomingEvents />
      <StatsSection />
      <NewsletterSection />
    </>
  );
}
