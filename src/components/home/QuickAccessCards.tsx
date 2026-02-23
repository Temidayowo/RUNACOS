"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Newspaper,
  Calendar,
  FileQuestion,
  AlertTriangle,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionWrapper";

const cards = [
  {
    title: "News & Updates",
    description: "Stay informed with the latest department and association news",
    icon: Newspaper,
    href: "/news",
    gradient: "from-blue-500 to-blue-600",
    glowColor: "hover:shadow-blue-500/20",
    bgTint: "bg-blue-500/5",
    iconColor: "text-blue-600",
    ringColor: "ring-blue-500/20",
  },
  {
    title: "Events",
    description: "Discover upcoming workshops, seminars, and social events",
    icon: Calendar,
    href: "/events",
    gradient: "from-emerald-500 to-emerald-600",
    glowColor: "hover:shadow-emerald-500/20",
    bgTint: "bg-emerald-500/5",
    iconColor: "text-emerald-600",
    ringColor: "ring-emerald-500/20",
  },
  {
    title: "Articles",
    description: "Explore tutorials, research insights, and career guides",
    icon: BookOpen,
    href: "/articles",
    gradient: "from-violet-500 to-violet-600",
    glowColor: "hover:shadow-violet-500/20",
    bgTint: "bg-violet-500/5",
    iconColor: "text-violet-600",
    ringColor: "ring-violet-500/20",
  },
  {
    title: "Past Questions",
    description: "Access previous exam questions and study materials",
    icon: FileQuestion,
    href: "/past-questions",
    gradient: "from-amber-500 to-amber-600",
    glowColor: "hover:shadow-amber-500/20",
    bgTint: "bg-amber-500/5",
    iconColor: "text-amber-600",
    ringColor: "ring-amber-500/20",
  },
  {
    title: "Report an Issue",
    description: "Submit maintenance and facility issues for quick resolution",
    icon: AlertTriangle,
    href: "/frms/report",
    gradient: "from-rose-500 to-rose-600",
    glowColor: "hover:shadow-rose-500/20",
    bgTint: "bg-rose-500/5",
    iconColor: "text-rose-600",
    ringColor: "ring-rose-500/20",
  },
  {
    title: "Executives",
    description: "Meet the student leaders driving RUNACOS forward",
    icon: Users,
    href: "/executives",
    gradient: "from-cyan-500 to-cyan-600",
    glowColor: "hover:shadow-cyan-500/20",
    bgTint: "bg-cyan-500/5",
    iconColor: "text-cyan-600",
    ringColor: "ring-cyan-500/20",
  },
];

export function QuickAccessCards() {
  return (
    <section className="relative bg-surface-1 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-dots pointer-events-none" />

      {/* Subtle decorative blurs */}
      <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-electric/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative container-custom">
        <AnimateOnScroll className="text-center mb-14">
          <p className="section-label mb-2">Quick Access</p>
          <div className="section-accent-line mx-auto" />
          <h2 className="section-heading">What are you looking for?</h2>
          <p className="mt-3 text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            Jump straight to the resources and tools you need most.
          </p>
        </AnimateOnScroll>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem key={card.title}>
              <Link href={card.href} className="block h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`group relative h-full overflow-hidden rounded-2xl border border-surface-3/80 bg-surface-0 p-6 transition-shadow duration-300 shadow-sm hover:shadow-xl ${card.glowColor}`}
                >
                  {/* Colored top bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Hover background tint */}
                  <div
                    className={`absolute inset-0 ${card.bgTint} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm transition-transform duration-300 group-hover:scale-110`}
                      >
                        <card.icon className="h-5 w-5 text-white" />
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 ${card.iconColor} opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 mt-1`}
                      />
                    </div>

                    <h3 className="mb-1.5 font-heading text-base font-semibold text-gray-900 group-hover:text-navy-800 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
