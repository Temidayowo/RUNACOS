"use client";

import { NewsCard } from "@/components/news/NewsCard";
import { StaggerContainer, StaggerItem, PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

const articles = [
  { id: "1", title: "Getting Started with Machine Learning in Python", slug: "ml-python-guide", excerpt: "A comprehensive beginner's guide to machine learning concepts and implementation using Python and scikit-learn.", coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80&fit=crop", category: "Tutorial", publishedAt: "2024-10-10", author: "Chidinma Okoro" },
  { id: "2", title: "The Future of Cloud Computing in Africa", slug: "cloud-computing-africa", excerpt: "Exploring how cloud technology is transforming businesses and education across the African continent.", coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&fit=crop", category: "Opinion", publishedAt: "2024-09-20", author: "Tunde Akinwale" },
  { id: "3", title: "Building Your First REST API with Node.js", slug: "rest-api-nodejs", excerpt: "Step-by-step tutorial on creating a production-ready REST API using Node.js, Express, and MongoDB.", coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80&fit=crop", category: "Tutorial", publishedAt: "2024-09-05", author: "Femi Adeyemi" },
];

export function ArticlesContent() {
  return (
    <PageTransition>
      <PageHero
        slug="articles"
        defaultHeading="Articles & Insights"
        defaultSubheading="Read tutorials, research insights, and opinions from RUNACOS members and faculty."
        breadcrumb="Home / Articles"
      />

      {/* Grid */}
      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <StaggerItem key={article.id}>
                <NewsCard news={{ ...article, slug: article.slug }} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
