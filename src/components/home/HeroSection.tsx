"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Calendar, Award } from "lucide-react";
import Lottie from "lottie-react";

interface Slide {
  id: string;
  type: "image" | "video" | "lottie";
  mediaUrl: string;
  title: string;
  highlight: string;
  subtitle: string;
  duration: number;
}

const fallbackSlides: Slide[] = [
  {
    id: "fb-1",
    type: "video",
    mediaUrl: "https://assets.mixkit.co/videos/41658/41658-720.mp4",
    title: "Shaping the Future of",
    highlight: "Computing Excellence",
    subtitle:
      "The official body representing the brilliant minds of the Department of Computer Science at Redeemer\u2019s University.",
    duration: 10,
  },
  {
    id: "fb-2",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80&fit=crop",
    title: "Building Tomorrow's",
    highlight: "Tech Leaders",
    subtitle:
      "Join a community of passionate computer science students pushing the boundaries of innovation.",
    duration: 4,
  },
  {
    id: "fb-3",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80&fit=crop",
    title: "Collaborate, Learn &",
    highlight: "Grow Together",
    subtitle:
      "From hackathons to workshops, we create opportunities for every student to thrive.",
    duration: 4,
  },
  {
    id: "fb-4",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80&fit=crop",
    title: "Excellence in",
    highlight: "Computer Science",
    subtitle:
      "Redeemer\u2019s University Department of Computer Science \u2014 fully accredited and nationally recognized.",
    duration: 4,
  },
  {
    id: "fb-5",
    type: "image",
    mediaUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80&fit=crop",
    title: "Your Gateway to the",
    highlight: "Tech Industry",
    subtitle:
      "Career fairs, internship connections, and industry partnerships to launch your career.",
    duration: 4,
  },
];

const floatingStats = [
  { icon: Users, value: "500+", label: "Members" },
  { icon: Calendar, value: "25+", label: "Events" },
  { icon: Award, value: "15+", label: "Awards" },
];

export function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lottieCache, setLottieCache] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch("/api/carousel")
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSlides(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Pre-fetch Lottie JSON data when slides change
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.type === "lottie" && slide.mediaUrl && !lottieCache[slide.mediaUrl]) {
        fetch(slide.mediaUrl)
          .then((res) => res.json())
          .then((data) => {
            setLottieCache((prev) => ({ ...prev, [slide.mediaUrl]: data }));
          })
          .catch(() => {});
      }
    });
  }, [slides, lottieCache]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const slide = slides[current];
    if (!slide) return;
    const timer = setTimeout(nextSlide, slide.duration * 1000);
    return () => clearTimeout(timer);
  }, [current, nextSlide, slides]);

  useEffect(() => {
    if (slides[current]?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current, slides]);

  if (slides.length === 0) return null;
  const currentSlide = slides[current];
  if (!currentSlide) return null;

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-midnight">
      {/* Dot-grid overlay */}
      <div className="absolute inset-0 bg-grid-dots-light opacity-30 z-[1] pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {/* Code brackets */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] text-white/[0.04] font-mono text-8xl font-bold select-none"
        >
          {"</>"}
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[6%] text-white/[0.04] font-mono text-7xl font-bold select-none"
        >
          {"{ }"}
        </motion.div>
        <motion.div
          animate={{ y: [-8, 12, -8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] left-[15%] text-white/[0.03] font-mono text-6xl font-bold select-none"
        >
          01
        </motion.div>
      </div>

      {/* Background slides with Ken Burns effect */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {currentSlide.type === "video" ? (
            <motion.video
              ref={videoRef}
              src={currentSlide.mediaUrl}
              autoPlay
              muted
              playsInline
              loop
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : currentSlide.type === "lottie" && lottieCache[currentSlide.mediaUrl] ? (
            <div className="absolute inset-0 flex items-center justify-center bg-midnight">
              <Lottie
                animationData={lottieCache[currentSlide.mediaUrl]}
                loop
                className="h-full w-full object-cover"
              />
            </div>
          ) : currentSlide.type === "lottie" ? (
            <div className="absolute inset-0 bg-midnight" />
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={currentSlide.mediaUrl}
                alt={currentSlide.highlight}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-midnight/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container-custom w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.25em] text-electric"
              >
                Welcome to RUNACOS
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {currentSlide.title}{" "}
                <span className="bg-gradient-to-r from-electric to-cyan bg-clip-text text-transparent">
                  {currentSlide.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-6 max-w-xl text-base text-white/70 sm:text-lg leading-relaxed"
              >
                {currentSlide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/membership"
                  className="inline-flex items-center rounded-xl bg-gradient-accent px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-electric/20 transition-all duration-200 hover:shadow-electric/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Become a Member
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                >
                  Explore RUNACOS
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Floating stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute bottom-28 right-8 hidden lg:flex gap-3"
          >
            {floatingStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/20">
                  <stat.icon className="h-4 w-4 text-electric" />
                </div>
                <div>
                  <div className="font-mono text-sm font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/50">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/60 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:text-white sm:left-6"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/60 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:text-white sm:right-6"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 z-20 h-[3px] w-full bg-white/5">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: currentSlide.duration, ease: "linear" }}
          className="h-full bg-gradient-to-r from-electric to-cyan"
        />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-electric"
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
