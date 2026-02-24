"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Newspaper } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import {
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { PageHero } from "@/components/ui/PageHero";
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

export function NewsContent() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const params = new URLSearchParams({
    status: "PUBLISHED",
    page: String(currentPage),
    limit: String(itemsPerPage),
  });
  if (activeCategory !== "All News") {
    params.set("category", activeCategory);
  }

  const { data, isLoading: loading } = useSWR(`/api/news?${params}`, fetcher);
  const news: NewsItem[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;

  return (
    <PageTransition>
      <PageHero
        slug="news"
        defaultHeading="News & Updates"
        defaultSubheading="Stay informed with the latest from the Department and RUNACOS."
        breadcrumb="Home / News"
      />

      {/* Filters */}
      <section className="border-b border-surface-3 sticky top-[72px] z-30 backdrop-blur-xl bg-white/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div className="flex overflow-x-auto flex-nowrap gap-2">
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={activeCategory === cat ? "pill-tab-active" : "pill-tab-inactive"}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              Sort: <span className="font-medium text-gray-600">Latest</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : news.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Newspaper className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No news articles found.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {news.map((item) => (
                    <StaggerItem key={item.id}>
                      <NewsCard news={item} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-600 hover:bg-surface-2 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-navy-800 text-white"
                      : "text-gray-600 hover:bg-surface-2"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-gray-600 hover:bg-surface-2 disabled:text-gray-300 disabled:hover:bg-transparent transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
