"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Target, Heart, Lightbulb, Users, Shield, Mail } from "lucide-react";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  fadeUp,
  slideLeft,
  slideRight,
  scaleIn,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

const coreValues = [
  { icon: Heart, title: "Excellence", description: "We strive for the highest standards in academics, leadership, and community service." },
  { icon: Lightbulb, title: "Innovation", description: "We embrace creativity and forward-thinking solutions to solve real-world problems." },
  { icon: Shield, title: "Integrity", description: "We uphold honesty, transparency, and ethical conduct in all our endeavors." },
  { icon: Users, title: "Community", description: "We foster a supportive environment where every member can thrive and grow together." },
];

const quickFacts = [
  { label: "Founded", value: "2005" },
  { label: "Members", value: "500+" },
  { label: "Department", value: "Computer Science" },
  { label: "Location", value: "Ede, Osun State" },
];

export function AboutContent() {
  return (
    <PageTransition>
      <PageHero
        slug="about"
        defaultHeading="About {highlight}RUNACOS{/highlight}"
        defaultSubheading="Our mission, vision, and the story behind the association."
        breadcrumb="Home / About"
      />

      {/* About Split */}
      <section className="py-16 md:py-24 bg-surface-0">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <AnimateOnScroll variants={slideLeft}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">About RUNACOS</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Founded on principles of academic excellence and technological advancement, RUNACOS
                    serves as the bridge between students, faculty, and the tech industry.
                  </p>
                </div>
                {/* Quick Facts */}
                <div className="rounded-xl bg-surface-1 border border-surface-3 p-5">
                  <h4 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">Quick Facts</h4>
                  <div className="space-y-2.5">
                    {quickFacts.map((fact) => (
                      <div key={fact.label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{fact.label}</span>
                        <span className="font-mono font-medium text-gray-900">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Contact */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Get in Touch</h4>
                  <p className="text-xs text-gray-500 mb-2">Have questions regarding membership or partnerships?</p>
                  <a href="mailto:info@runacos.org" className="inline-flex items-center gap-1.5 text-sm font-mono text-electric hover:underline">
                    <Mail className="h-3.5 w-3.5" /> info@runacos.org
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Main Content */}
            <AnimateOnScroll variants={slideRight}>
              <div>
                <p className="section-label mb-2">Association Overview</p>
                <div className="section-accent-line" />
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Who We Are</h2>
                <div className="prose-custom">
                  <p>
                    <strong>The Redeemer&apos;s University Association of Computer Science Students (RUNACOS)</strong> is the premier
                    student body dedicated to the welfare, academic growth, and professional development of all
                    Computer Science students at Redeemer&apos;s University.
                  </p>
                  <p>
                    We operate as an autonomous body under the supervision of the Department of Computer Science,
                    fostering a community where innovation thrives. Our association provides a platform for students to
                    collaborate on projects, share knowledge, and prepare for the dynamic challenges of the global
                    technology landscape.
                  </p>
                  <div className="my-8 overflow-hidden rounded-xl aspect-video relative">
                    <Image
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&fit=crop"
                      alt="RUNACOS members collaborating during annual Hackathon"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 700px"
                    />
                  </div>
                  <p>
                    Through workshops, seminars, hackathons, and mentorship programs, we bridge the gap between
                    theoretical knowledge and practical application, ensuring our members are industry-ready upon
                    graduation.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative bg-surface-1 py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
        <div className="relative container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimateOnScroll variants={scaleIn}>
              <div className="rounded-xl border border-surface-3 bg-surface-0 p-8 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-electric to-cyan" />
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Eye className="h-5 w-5 text-electric" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  To be a world-class student association that produces innovative, ethical, and
                  technically proficient leaders who will drive technological advancement globally.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variants={scaleIn} delay={0.15}>
              <div className="rounded-xl bg-navy-800 p-8 text-white relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan to-emerald-400" />
                <div className="absolute inset-0 bg-grid-dots-light opacity-20 pointer-events-none" />
                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Target className="h-5 w-5 text-cyan" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-bold text-white">Our Mission</h3>
                  <p className="text-sm leading-relaxed text-navy-100">
                    To create an enabling environment that fosters academic excellence,
                    encourages technological innovation, and promotes professional ethics
                    among computer science students through strategic partnerships and
                    continuous learning.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-surface-0">
        <div className="container-custom">
          <AnimateOnScroll className="mb-12">
            <p className="section-label mb-2">What Drives Us</p>
            <div className="section-accent-line" />
            <h2 className="section-heading">Core Values</h2>
            <p className="mt-2 text-gray-500">
              Our values define who we are and guide our actions as an association.
            </p>
          </AnimateOnScroll>

          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-surface-3 bg-surface-0 p-6 transition-all hover:shadow-card-hover"
                >
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-electric/5 transition-transform group-hover:scale-110">
                    <value.icon className="h-5 w-5 text-electric" />
                  </div>
                  <h4 className="mb-2 font-heading text-base font-semibold text-gray-900">{value.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
