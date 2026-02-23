"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  slug: string;
  defaultHeading: string;
  defaultSubheading: string;
  breadcrumb: string;
}

interface HeroConfig {
  heading: string;
  subheading: string;
  backgroundImage: string;
}

// Global cache shared across all PageHero instances — one fetch hydrates all pages
let heroCache: Record<string, HeroConfig> | null = null;
let fetchPromise: Promise<Record<string, HeroConfig>> | null = null;

function fetchAllHeroes(): Promise<Record<string, HeroConfig>> {
  if (heroCache) return Promise.resolve(heroCache);
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/pages")
    .then((res) => res.json())
    .then((res) => {
      heroCache = res.data || {};
      return heroCache!;
    })
    .catch(() => {
      heroCache = {};
      return heroCache;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

function renderHeading(text: string) {
  // Supports {highlight}text{/highlight} syntax for gradient-colored text
  const parts = text.split(/\{highlight\}|\{\/highlight\}/);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className="bg-gradient-to-r from-electric to-cyan bg-clip-text text-transparent"
          >
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

export function PageHero({
  slug,
  defaultHeading,
  defaultSubheading,
  breadcrumb,
}: PageHeroProps) {
  const [heading, setHeading] = useState(defaultHeading);
  const [subheading, setSubheading] = useState(defaultSubheading);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    // Check cache first — instant if already fetched by another PageHero
    if (heroCache) {
      const config = heroCache[slug];
      if (config) {
        if (config.heading) setHeading(config.heading);
        if (config.subheading) setSubheading(config.subheading);
        if (config.backgroundImage) setBackgroundImage(config.backgroundImage);
      }
      return;
    }

    fetchAllHeroes().then((heroes) => {
      const config = heroes[slug];
      if (config) {
        if (config.heading) setHeading(config.heading);
        if (config.subheading) setSubheading(config.subheading);
        if (config.backgroundImage) setBackgroundImage(config.backgroundImage);
      }
    });
  }, [slug, defaultHeading, defaultSubheading]);

  return (
    <section className={`relative overflow-hidden py-20 md:py-28 text-center ${!backgroundImage ? "page-hero" : ""}`}>
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-midnight/80" />
        </>
      )}
      <div className="relative container-custom">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs uppercase tracking-widest text-electric mb-1"
        >
          {breadcrumb}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-3xl font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl"
        >
          {renderHeading(heading)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-navy-200"
        >
          {subheading}
        </motion.p>
      </div>
    </section>
  );
}
