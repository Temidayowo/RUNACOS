"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, Loader2, Newspaper } from "lucide-react";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionWrapper";
import { NewsCard } from "@/components/news/NewsCard";
import { fetcher } from "@/lib/fetcher";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  publishedAt: string | null;
  author: string;
}

export function LatestNews() {
  const { data, isLoading } = useSWR("/api/news?status=PUBLISHED&limit=3", fetcher);
  const news: NewsItem[] = data?.data || [];
  const loading = isLoading;

  return (
    <section className="bg-surface-0 py-16 md:py-24">
      <div className="container-custom">
        <AnimateOnScroll className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="section-label mb-2">Latest News</p>
            <div className="section-accent-line" />
            <h2 className="section-heading">What&apos;s Happening</h2>
            <p className="mt-2 text-gray-500">
              Stay connected with RUNACOS updates
            </p>
          </div>
          <Link
            href="/news"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-navy-800 hover:text-electric transition-colors"
          >
            View All News
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateOnScroll>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Newspaper className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No news articles yet.</p>
          </div>
        ) : (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <StaggerItem key={item.id}>
                <NewsCard news={item} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
