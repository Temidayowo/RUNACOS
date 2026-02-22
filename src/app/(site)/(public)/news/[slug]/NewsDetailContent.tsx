"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { PageTransition } from "@/components/ui/MotionWrapper";

export function NewsDetailContent() {
  const params = useParams();

  return (
    <PageTransition>
      <article className="py-12 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link
                href="/news"
                className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to News
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="badge-blue mb-3">Academics</span>
              <h1 className="font-heading text-3xl font-extrabold text-gray-900 sm:text-4xl">
                News Article
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> <span className="font-mono">October 15, 2024</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> RUNACOS Admin
                </span>
              </div>
            </motion.div>

            {/* Cover Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 aspect-[21/9] overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-600"
            >
              <div className="flex h-full items-center justify-center text-white/30 text-lg font-bold">
                RUNACOS
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose-custom mt-10"
            >
              <p>
                This is a placeholder for the full news article content. In production,
                this content would be fetched from the database based on the slug parameter.
              </p>
              <p>
                The article would contain rich text content including headings, paragraphs,
                images, and other formatted elements created through the admin CMS.
              </p>
              <h2>Key Highlights</h2>
              <ul>
                <li>Important detail about the news item</li>
                <li>Another significant point worth noting</li>
                <li>Additional context and background information</li>
              </ul>
              <p>
                For more information, please contact the RUNACOS executive council or
                visit the Department of Computer Science office.
              </p>
            </motion.div>

            {/* Divider */}
            <div className="my-12 border-t border-surface-3" />

            {/* Related */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-6 font-heading text-xl font-bold text-gray-900">Related News</h3>
              <p className="text-sm text-gray-500">Related articles will appear here.</p>
            </motion.div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
