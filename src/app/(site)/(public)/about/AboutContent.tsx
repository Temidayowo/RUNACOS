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
  AnimatedCounter,
  PageTransition,
} from "@/components/ui/MotionWrapper";

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
      {/* Hero */}
      <section className="bg-white py-16 md:py-24 text-center">
        <div className="container-custom">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-4"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-4xl font-serif text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Empowering the Future of{" "}
            <span className="text-blue-600">Technology &amp; Innovation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-gray-500"
          >
            The official body representing the brilliant minds of the Department of
            Computer Science at Redeemer&apos;s University.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link href="#" className="btn-primary px-6 py-3">Read Our Constitution</Link>
            <Link href="/executives" className="btn-secondary px-6 py-3">Meet the Executives</Link>
          </motion.div>
        </div>
      </section>

      {/* About Split */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <AnimateOnScroll variants={slideLeft}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-3">About RUNACOS</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Founded on principles of academic excellence and technological advancement, RUNACOS
                    serves as the bridge between students, faculty, and the tech industry.
                  </p>
                </div>
                {/* Quick Facts */}
                <div className="rounded-lg bg-gray-50 p-5">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Facts</h4>
                  <div className="space-y-2.5">
                    {quickFacts.map((fact) => (
                      <div key={fact.label} className="flex justify-between text-sm">
                        <span className="text-gray-500">{fact.label}</span>
                        <span className="font-medium text-gray-900">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Contact */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Get in Touch</h4>
                  <p className="text-xs text-gray-500 mb-2">Have questions regarding membership or partnerships?</p>
                  <a href="mailto:info@runacos.org" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                    <Mail className="h-3.5 w-3.5" /> info@runacos.org
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Main Content */}
            <AnimateOnScroll variants={slideRight}>
              <div>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-2xl font-bold text-gray-900">
                  <span className="text-gray-300">&mdash;</span> Association Overview
                </h2>
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
                  <div className="my-8 overflow-hidden rounded-lg aspect-video relative">
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
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-2">
            <AnimateOnScroll variants={scaleIn}>
              <div className="rounded-xl border border-gray-100 bg-white p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-gray-900">Our Vision</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  To be a world-class student association that produces innovative, ethical, and
                  technically proficient leaders who will drive technological advancement globally.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variants={scaleIn} delay={0.15}>
              <div className="rounded-xl bg-navy-800 p-8 text-white">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-600">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold">Our Mission</h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  To create an enabling environment that fosters academic excellence,
                  encourages technological innovation, and promotes professional ethics
                  among computer science students through strategic partnerships and
                  continuous learning.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <AnimateOnScroll className="mb-12">
            <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
              <span className="text-gray-300">&mdash;</span> Core Values
            </h2>
            <p className="mt-2 text-gray-500">
              Our values define who we are and guide our actions and decisions as an association.
            </p>
          </AnimateOnScroll>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <StaggerItem key={value.title}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  className="rounded-lg border border-gray-100 bg-white p-6 transition-all"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                    <value.icon className="h-5 w-5 text-navy-800" />
                  </div>
                  <h4 className="mb-2 font-serif text-base font-bold text-gray-900">{value.title}</h4>
                  <p className="text-sm text-gray-500">{value.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
