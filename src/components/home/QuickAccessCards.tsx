"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, Calendar, FileQuestion, AlertTriangle } from "lucide-react";
import { AnimateOnScroll, StaggerContainer, StaggerItem, fadeUp } from "@/components/ui/MotionWrapper";

const cards = [
  {
    title: "News & Updates",
    description: "Stay informed with the latest department and association news",
    icon: Newspaper,
    href: "/news",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Events",
    description: "Discover upcoming workshops, seminars, and social events",
    icon: Calendar,
    href: "/events",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Past Questions",
    description: "Access previous exam questions and study materials",
    icon: FileQuestion,
    href: "/past-questions",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Report a Fault",
    description: "Submit maintenance and facility issues for quick resolution",
    icon: AlertTriangle,
    href: "/frms/report",
    color: "bg-orange-50 text-orange-600",
  },
];

export function QuickAccessCards() {
  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="container-custom">
        <AnimateOnScroll className="text-center mb-12">
          <p className="section-label mb-2">Quick Access</p>
          <h2 className="section-heading">What are you looking for?</h2>
        </AnimateOnScroll>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <StaggerItem key={card.title}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  className="group rounded-lg border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-blue-200"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${card.color}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-bold text-gray-900 group-hover:text-navy-800">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
