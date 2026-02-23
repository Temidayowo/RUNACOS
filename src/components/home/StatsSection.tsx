"use client";

import { Users, Calendar, Newspaper, Award } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/MotionWrapper";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

const stats = [
  { target: 500, suffix: "+", label: "Active Members", icon: Users },
  { target: 50, suffix: "+", label: "Events Held", icon: Calendar },
  { target: 120, suffix: "+", label: "Articles", icon: Newspaper },
  { target: 15, suffix: "+", label: "Awards Won", icon: Award },
];

export function StatsSection() {
  return (
    <section className="relative bg-navy-800 py-16 md:py-24 overflow-hidden">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-grid-dots-light opacity-40 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container-custom">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => (
            <AnimateOnScroll
              key={stat.label}
              variants={fadeUp}
              delay={i * 0.1}
              className="text-center"
            >
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <stat.icon className="h-5 w-5 text-electric" />
                </div>

                {/* Counter */}
                <div className="font-mono text-3xl font-bold text-white sm:text-4xl md:text-5xl tracking-tight">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    duration={1.5}
                  />
                </div>

                {/* Label */}
                <p className="mt-2 text-sm text-navy-100 sm:text-base">
                  {stat.label}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
