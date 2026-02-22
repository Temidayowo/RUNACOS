"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";

interface Executive {
  id: string;
  name: string;
  position: string;
  image: string | null;
  email: string | null;
}

const fallbackExecs = [
  { id: "f1", name: "Adebayo Olamide", position: "President", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f2", name: "Chidinma Okoro", position: "Vice President", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f3", name: "Tunde Akinwale", position: "General Secretary", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f4", name: "Blessing Eze", position: "Financial Secretary", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f5", name: "Femi Adeyemi", position: "Director of Socials", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f6", name: "Grace Nwosu", position: "Public Relations Officer", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f7", name: "Yusuf Ibrahim", position: "Director of Sports", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&q=80&fit=crop&crop=face", email: null },
  { id: "f8", name: "Amina Bello", position: "Welfare Director", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80&fit=crop&crop=face", email: null },
];

export function ExecutivesContent() {
  const [executives, setExecutives] = useState<Executive[]>(fallbackExecs);

  useEffect(() => {
    fetch("/api/executives")
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setExecutives(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PageTransition>
      {/* Header */}
      <section className="bg-white py-16 md:py-20 text-center">
        <div className="container-custom">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">
            Leadership
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Meet Our Executives
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-lg text-gray-500"
          >
            The dedicated leaders steering RUNACOS towards excellence and innovation.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {executives.map((exec) => (
              <StaggerItem key={exec.id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group text-center"
                >
                  {/* Photo */}
                  <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full ring-4 ring-transparent transition-all group-hover:ring-navy-200">
                    {exec.image ? (
                      <Image
                        src={exec.image}
                        alt={exec.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-600">
                        <span className="text-3xl font-bold text-white/60">
                          {exec.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 group-hover:text-navy-800 transition-colors">
                    {exec.name}
                  </h3>
                  <p className="text-sm text-blue-600">{exec.position}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    {[
                      ...(exec.email
                        ? [{ Icon: Mail, href: `mailto:${exec.email}` }]
                        : []),
                      { Icon: Linkedin, href: "#" },
                      { Icon: Twitter, href: "#" },
                      ...(!exec.email ? [{ Icon: Mail, href: "#" }] : []),
                    ].map(({ Icon, href }, i) => (
                      <motion.a
                        key={i}
                        href={href}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-navy-800 hover:text-white transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
