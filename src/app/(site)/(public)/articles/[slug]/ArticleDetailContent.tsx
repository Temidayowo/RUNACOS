"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { PageTransition } from "@/components/ui/MotionWrapper";

export function ArticleDetailContent() {
  return (
    <PageTransition>
      <article className="py-12 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link href="/articles" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-800 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Articles
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="badge-blue mb-3">Tutorial</span>
              <h1 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl">Article Title</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> October 10, 2024</span>
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Author Name</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 5 min read</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 aspect-[21/9] overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-600"
            >
              <div className="flex h-full items-center justify-center text-white/30 text-lg font-bold">RUNACOS</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose-custom mt-10">
              <p>Article content would appear here, fetched from the database based on the slug.</p>
              <p>This content supports rich text formatting including headings, lists, code blocks, images, and links.</p>
            </motion.div>
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
