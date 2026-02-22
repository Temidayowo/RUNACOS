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
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accentColor: "group-hover:border-blue-200",
  },
  {
    title: "Events",
    description: "Discover upcoming workshops, seminars, and social events",
    icon: Calendar,
    href: "/events",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentColor: "group-hover:border-emerald-200",
  },
  {
    title: "Articles",
    description: "Explore tutorials, research insights, and career guides",
    icon: BookOpen,
    href: "/articles",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    accentColor: "group-hover:border-violet-200",
  },
  {
    title: "Past Questions",
    description: "Access previous exam questions and study materials",
    icon: FileQuestion,
    href: "/past-questions",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accentColor: "group-hover:border-amber-200",
  },
  {
    title: "Report a Fault",
    description: "Submit maintenance and facility issues for quick resolution",
    icon: AlertTriangle,
    href: "/frms/report",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accentColor: "group-hover:border-rose-200",
  },
  {
    title: "Executives",
    description: "Meet the student leaders driving RUNACOS forward",
    icon: Users,
    href: "/executives",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    accentColor: "group-hover:border-cyan-200",
  },
];

export function QuickAccessCards() {
  return (
    <section className="relative bg-surface-1 py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
      <div className="relative container-custom">
        <AnimateOnScroll className="text-center mb-12">
          <p className="section-label mb-2">Quick Access</p>
          <div className="section-accent-line mx-auto" />
          <h2 className="section-heading">What are you looking for?</h2>
        </AnimateOnScroll>

        <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem key={card.title}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-xl border border-surface-3 bg-surface-0 p-6 transition-all duration-300 hover:shadow-card-hover ${card.accentColor}`}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-electric/0 via-electric/40 to-electric/0 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <h3 className="mb-1.5 font-heading text-base font-semibold text-gray-900 group-hover:text-navy-800">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
