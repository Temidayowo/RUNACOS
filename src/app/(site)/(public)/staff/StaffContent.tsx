"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, BookOpen, Loader2 } from "lucide-react";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

interface StaffMember {
  id: string;
  name: string;
  title: string;
  specialty: string | null;
  department: string | null;
  email: string | null;
  image: string | null;
}

export function StaffContent() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff")
      .then((res) => res.json())
      .then((res) => setStaff(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <PageHero
        slug="staff"
        defaultHeading="Department Staff"
        defaultSubheading="The brilliant minds shaping the next generation of computer scientists."
        breadcrumb="Home / Staff"
      />

      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No staff members to display at this time.</p>
            </div>
          ) : (
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {staff.map((member) => (
                <StaggerItem key={member.id}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-600">
                          <span className="text-xl font-bold text-white/70">
                            {member.name.split(" ").slice(-1)[0][0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-base font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm font-medium text-blue-600">{member.title}</p>
                    {member.specialty && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                        <BookOpen className="h-3 w-3" />
                        {member.specialty}
                      </div>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </a>
                    )}
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
