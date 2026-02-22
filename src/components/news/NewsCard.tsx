"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string | null;
    category: string;
    publishedAt: string | Date | null;
    author?: string;
  };
}

const categoryBadge: Record<string, string> = {
  Academics: "badge-keyword",
  Events: "badge-warning",
  "Student Life": "badge-string",
  General: "badge-comment",
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="group h-full overflow-hidden rounded-xl border border-surface-3 bg-surface-0 transition-all duration-300 hover:shadow-glow-blue"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
          {news.coverImage ? (
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-hero">
              <span className="text-3xl font-bold text-white/20 font-heading">R</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <span className={categoryBadge[news.category] || "badge-comment"}>
              {news.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-gray-400">
              <Calendar className="h-3 w-3" />
              {news.publishedAt ? formatDateShort(news.publishedAt) : "Draft"}
            </span>
          </div>

          <h3 className="mb-2 font-heading text-base font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-navy-800 transition-colors">
            {news.title}
          </h3>

          <p className="mb-4 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-electric group-hover:text-blue-700 transition-colors">
            Read More
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
