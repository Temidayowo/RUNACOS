"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NewsCard } from "@/components/news/NewsCard";
import {
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { NEWS_CATEGORIES } from "@/lib/constants";

const allNews = [
  { id: "1", title: "Computer Science Department Accreditation Success", slug: "cs-accreditation-success", excerpt: "We are pleased to announce that the NUC accreditation team has fully accredited our Computer Science program for another five years.", coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80&fit=crop", category: "Academics", publishedAt: "2024-10-15", author: "RUNACOS Admin" },
  { id: "2", title: 'Annual RUNACOS Hackathon: "Innovating for Nigeria"', slug: "annual-hackathon-2024", excerpt: "Join us for a 48-hour coding marathon challenge. Students develop practical solutions for local challenges using cutting-edge technology.", coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80&fit=crop", category: "Events", publishedAt: "2024-10-12", author: "RUNACOS Admin" },
  { id: "3", title: "Meet the New RUNACOS Executive Council 2023/2024", slug: "new-executive-council", excerpt: "The elections have concluded, an entire new set of leaders has emerged to steer the association forward.", coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80&fit=crop", category: "Student Life", publishedAt: "2024-09-28", author: "RUNACOS Admin" },
  { id: "4", title: "Important: First Semester Examination Schedule Released", slug: "exam-schedule-released", excerpt: "The examination timetable for the current academic session is now available on the notice board and student portal.", coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80&fit=crop", category: "Academics", publishedAt: "2024-09-15", author: "RUNACOS Admin" },
  { id: "5", title: "Faculty Spotlight: Dr. Adebayo's AI Research Breakthrough", slug: "faculty-spotlight-ai", excerpt: "Our very own Dr. Adebayo's research has published a groundbreaking paper on AI applications in African agriculture.", coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&fit=crop", category: "Academics", publishedAt: "2024-08-25", author: "RUNACOS Admin" },
  { id: "6", title: "Tech Career Fair 2023: Bridging the Gap", slug: "career-fair-2023", excerpt: "Top tech companies in Lagos are coming to campus. Prepare your CVs and portfolios for a chance to network and secure internships.", coverImage: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&q=80&fit=crop", category: "Events", publishedAt: "2024-08-15", author: "RUNACOS Admin" },
];

export function NewsContent() {
  const [activeCategory, setActiveCategory] = useState("All News");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredNews = activeCategory === "All News"
    ? allNews
    : allNews.filter((n) => n.category === activeCategory);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PageTransition>
      {/* Page Hero */}
      <section className="page-hero text-center">
        <div className="relative container-custom">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-widest text-electric mb-1">
            Home / News
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            News & Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-navy-200"
          >
            Stay informed with the latest from the Department and RUNACOS.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-surface-0 border-b border-surface-3 sticky top-[72px] z-30 backdrop-blur-xl bg-white/90">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div className="flex flex-wrap gap-2">
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedNews.map((item) => (
                  <StaggerItem key={item.id}>
                    <NewsCard news={item} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          </AnimatePresence>

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
