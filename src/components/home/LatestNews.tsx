"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import { NewsCard } from "@/components/news/NewsCard";

// Placeholder data - will be replaced with real data
const placeholderNews = [
  {
    id: "1",
    title: "Computer Science Department Accreditation Success",
    slug: "cs-accreditation-success",
    excerpt: "We are pleased to announce that the NUC accreditation team has fully accredited our Computer Science program for another five years.",
    coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&fit=crop",
    category: "Academics",
    publishedAt: "2024-10-15",
    author: "RUNACOS Admin",
  },
  {
    id: "2",
    title: 'Annual RUNACOS Hackathon: "Innovating for Nigeria"',
    slug: "annual-hackathon-2024",
    excerpt: "Join us for a 48-hour coding marathon challenge. Students develop practical solutions for local challenges using cutting-edge technology.",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&fit=crop",
    category: "Events",
    publishedAt: "2024-10-12",
    author: "RUNACOS Admin",
  },
  {
    id: "3",
    title: "Meet the New RUNACOS Executive Council 2023/2024",
    slug: "new-executive-council",
    excerpt: "The elections have concluded, entire new set of leaders has emerged to steer the association forward. Get to know your President, VP, and more.",
    coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fit=crop",
    category: "Student Life",
    publishedAt: "2024-09-28",
    author: "RUNACOS Admin",
  },
];

export function LatestNews() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-custom">
        <AnimateOnScroll className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="section-label mb-2">&mdash; Latest News</p>
            <h2 className="section-heading">Stay Updated</h2>
            <p className="mt-2 text-gray-500">The latest from the department and association</p>
          </div>
          <Link
            href="/news"
            className="group inline-flex items-center gap-1 text-sm font-medium text-navy-800 hover:text-blue-600 transition-colors"
          >
            View All News
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateOnScroll>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderNews.map((item) => (
            <StaggerItem key={item.id}>
              <NewsCard news={item} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
