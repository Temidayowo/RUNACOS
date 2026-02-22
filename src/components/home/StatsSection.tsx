"use client";

import { AnimatedCounter } from "@/components/ui/MotionWrapper";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

const stats = [
  { target: 500, suffix: "+", label: "Members" },
  { target: 50, suffix: "+", label: "Events Held" },
  { target: 10, suffix: "+", label: "Projects" },
  { target: 15, suffix: "+", label: "Awards" },
];

export function StatsSection() {
  return (
    <section className="bg-navy-800 py-16 md:py-20">
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimateOnScroll
              key={stat.label}
              variants={fadeUp}
              delay={i * 0.1}
              className="text-center"
            >
              <div className="font-serif text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={1.5}
                />
              </div>
              <p className="mt-2 text-sm text-gray-300 sm:text-base">
                {stat.label}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
