"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, Loader2 } from "lucide-react";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { fetcher } from "@/lib/fetcher";
import { formatDateShort } from "@/lib/utils";

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  author: string;
  publishedAt: string | null;
  createdAt: string;
}

export function ArticleDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading: loading, error: swrError } = useSWR(
    slug ? `/api/articles/${slug}` : null,
    fetcher
  );
  const article: ArticleData | null = data?.data || null;
  const error = swrError || (data && !data.data);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
        </div>
      </PageTransition>
    );
  }

  if (error || !article) {
    return (
      <PageTransition>
        <div className="py-20 text-center">
          <p className="text-gray-500">Article not found</p>
          <Link href="/articles" className="mt-4 inline-flex btn-primary text-sm">
            Back to Articles
          </Link>
        </div>
      </PageTransition>
    );
  }

  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

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
              <span className="badge-blue mb-3">{article.category}</span>
              <h1 className="font-heading text-3xl font-extrabold text-gray-900 sm:text-4xl">{article.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono">{formatDateShort(article.publishedAt || article.createdAt)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{readTime} min read</span>
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mt-8 aspect-[21/9] overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-navy-600"
            >
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/30 text-lg font-bold">RUNACOS</div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose-custom mt-10"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </article>
    </PageTransition>
  );
}
