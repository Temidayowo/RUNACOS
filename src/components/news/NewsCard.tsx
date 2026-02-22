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

const categoryColors: Record<string, string> = {
  Academics: "badge-blue",
  Events: "badge-orange",
  "Student Life": "badge-green",
  General: "badge-gray",
};

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group h-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {news.coverImage ? (
            <Image
              src={news.coverImage}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-600">
              <span className="text-3xl font-bold text-white/30">R</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar className="h-3 w-3" />
              {news.publishedAt ? formatDateShort(news.publishedAt) : "Draft"}
            </span>
            <span className={categoryColors[news.category] || "badge-gray"}>
              {news.category}
            </span>
          </div>

          <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-navy-800 transition-colors">
            {news.title}
          </h3>

          <p className="mb-4 text-sm text-gray-500 line-clamp-3">
            {news.excerpt}
          </p>

          <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
            Read More
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
