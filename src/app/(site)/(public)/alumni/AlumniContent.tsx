"use client";

import { useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Loader2, Crown } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";
import { fetcher } from "@/lib/fetcher";

interface Alumni {
  id: string;
  firstName: string;
  lastName: string;
  department: string | null;
  passportUrl: string;
  admissionYear: number | null;
  alumniSince: string | null;
  executive: { id: string; position: string; active: boolean } | null;
}

export function AlumniContent() {
  const { data, isLoading: loading } = useSWR("/api/alumni", fetcher);

  const alumni = useMemo(() => {
    const list: Alumni[] = data?.data || [];
    return [...list].sort((a, b) => {
      if (a.executive && !b.executive) return -1;
      if (!a.executive && b.executive) return 1;
      return 0;
    });
  }, [data]);

  return (
    <PageTransition>
      <PageHero
        slug="alumni"
        defaultHeading="Our Alumni"
        defaultSubheading="Celebrating the distinguished graduates of RUNACOS who continue to make an impact in the tech industry."
        breadcrumb="Home / Alumni"
      />

      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-electric" />
            </div>
          ) : alumni.length === 0 ? (
            <div className="py-20 text-center">
              <GraduationCap className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-lg font-heading font-semibold text-gray-400">
                No alumni listed yet
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Check back soon for updates.
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {alumni.map((person) => (
                <StaggerItem key={person.id}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(59,130,246,0.08)" }}
                    className="group overflow-hidden rounded-xl border border-surface-3 bg-surface-0 transition-all"
                  >
                    {/* Photo */}
                    <div className="relative h-48 bg-gradient-to-br from-navy-800 to-navy-600">
                      {person.passportUrl ? (
                        <Image
                          src={person.passportUrl}
                          alt={`${person.firstName} ${person.lastName}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl font-bold text-white/20">
                            {person.firstName[0]}{person.lastName[0]}
                          </span>
                        </div>
                      )}
                      {/* Former Executive Badge */}
                      {person.executive && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <Crown className="h-3 w-3" /> {person.executive.position}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-gray-900">
                        {person.firstName} {person.lastName}
                      </h3>
                      {person.department && (
                        <p className="text-sm text-gray-500">{person.department}</p>
                      )}
                      {person.admissionYear && (
                        <p className="text-xs font-mono text-gray-400 mt-1">
                          Class of {person.admissionYear + 4}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
