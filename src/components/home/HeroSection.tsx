"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  type: "image" | "video";
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
    title: "Empowering the Future of",
    highlight: "Technology & Innovation",
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

export function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch carousel slides from API
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

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance based on current slide's duration
  useEffect(() => {
    if (slides.length === 0) return;
    const slide = slides[current];
    if (!slide) return;
    const timer = setTimeout(nextSlide, slide.duration * 1000);
    return () => clearTimeout(timer);
  }, [current, nextSlide, slides]);

  // Play video when slide changes
  useEffect(() => {
    if (slides[current]?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [current, slides]);

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[current];
  if (!currentSlide) return null;

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-navy-900">
      {/* Background slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {currentSlide.type === "video" ? (
            <video
              ref={videoRef}
              src={currentSlide.mediaUrl}
              autoPlay
              muted
              playsInline
              loop
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={currentSlide.mediaUrl}
              alt={currentSlide.highlight}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container-custom text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Established 2005
              </p>
              <h1 className="mx-auto max-w-4xl font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                {currentSlide.title}{" "}
                <span className="text-blue-400">
                  {currentSlide.highlight}
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
                {currentSlide.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/constitution"
                    className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-navy-800 transition-colors hover:bg-gray-100"
                  >
                    Read Our Constitution
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/executives"
                    className="inline-flex items-center rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    Meet the Executives
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Previous / Next arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/10">
        <motion.div
          key={current}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: currentSlide.duration, ease: "linear" }}
          className="h-full bg-blue-400"
        />
      </div>
    </section>
  );
}
