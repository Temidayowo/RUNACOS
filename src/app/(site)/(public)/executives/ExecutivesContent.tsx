"use client";

import useSWR from "swr";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Instagram, Mail } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";
import { fetcher } from "@/lib/fetcher";

interface Executive {
  id: string;
  name: string;
  position: string;
  image: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
}

const fallbackExecs: Executive[] = [
  { id: "f1", name: "Adebayo Olamide", position: "President", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f2", name: "Chidinma Okoro", position: "Vice President", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f3", name: "Tunde Akinwale", position: "General Secretary", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f4", name: "Blessing Eze", position: "Financial Secretary", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f5", name: "Femi Adeyemi", position: "Director of Socials", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f6", name: "Grace Nwosu", position: "Public Relations Officer", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f7", name: "Yusuf Ibrahim", position: "Director of Sports", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
  { id: "f8", name: "Amina Bello", position: "Welfare Director", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&q=80&fit=crop&crop=face", email: null, linkedin: null, twitter: null, instagram: null },
];

export function ExecutivesContent() {
  const { data } = useSWR("/api/executives", fetcher);
  const executives: Executive[] = data?.data?.length > 0 ? data.data : fallbackExecs;

  const president = executives[0];
  const otherExecs = executives.slice(1);

  return (
    <PageTransition>
      <PageHero
        slug="executives"
        defaultHeading="Meet Our Executive Council"
        defaultSubheading="The student leaders driving RUNACOS forward."
        breadcrumb="Home / Executives"
      />

      {/* President Spotlight */}
      {president && (
        <section className="py-12 md:py-16 bg-surface-0">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-surface-3 bg-surface-1 p-8 md:p-10"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric to-cyan" />

              <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
                {/* Photo */}
                <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl ring-4 ring-electric/10">
                  {president.image ? (
                    <Image src={president.image} alt={president.name} fill className="object-cover" sizes="144px" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-hero">
                      <span className="text-4xl font-bold text-white/60 font-heading">
                        {president.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left">
                  <span className="badge-keyword mb-2 inline-block">President</span>
                  <h2 className="font-heading text-2xl font-bold text-gray-900 md:text-3xl">{president.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">Department of Computer Science</p>
                  <div className="mt-4 flex justify-center gap-2 md:justify-start">
                    {[
                      ...(president.linkedin ? [{ Icon: Linkedin, href: president.linkedin }] : []),
                      ...(president.twitter ? [{ Icon: Twitter, href: president.twitter }] : []),
                      ...(president.instagram ? [{ Icon: Instagram, href: president.instagram }] : []),
                      ...(president.email ? [{ Icon: Mail, href: `mailto:${president.email}` }] : []),
                    ].map(({ Icon, href }, i) => (
                      <motion.a
                        key={i}
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        whileHover={{ scale: 1.1 }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-gray-400 hover:bg-electric hover:text-white transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Executive Grid */}
      <section className="relative py-12 md:py-16 bg-surface-1">
        <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
        <div className="relative container-custom">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
            {otherExecs.map((exec) => (
              <StaggerItem key={exec.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-surface-3 bg-surface-0 p-6 text-center transition-all hover:shadow-card-hover"
                >
                  {/* Photo */}
                  <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-2xl ring-2 ring-transparent transition-all group-hover:ring-electric/20">
                    {exec.image ? (
                      <Image src={exec.image} alt={exec.name} fill className="object-cover" sizes="112px" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-hero">
                        <span className="text-2xl font-bold text-white/60 font-heading">
                          {exec.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-gray-900 group-hover:text-navy-800 transition-colors">
                    {exec.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-electric">{exec.position}</p>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {[
                      ...(exec.linkedin ? [{ Icon: Linkedin, href: exec.linkedin }] : []),
                      ...(exec.twitter ? [{ Icon: Twitter, href: exec.twitter }] : []),
                      ...(exec.instagram ? [{ Icon: Instagram, href: exec.instagram }] : []),
                      ...(exec.email ? [{ Icon: Mail, href: `mailto:${exec.email}` }] : []),
                    ].map(({ Icon, href }, i) => (
                      <motion.a
                        key={i}
                        href={href}
                        target={href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                        whileHover={{ scale: 1.15 }}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-gray-400 hover:bg-navy-800 hover:text-white transition-colors"
                      >
                        <Icon className="h-3 w-3" />
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
