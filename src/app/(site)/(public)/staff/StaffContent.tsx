"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, BookOpen } from "lucide-react";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";

const staff = [
  { name: "Prof. Adebayo Johnson", title: "Head of Department", specialty: "Artificial Intelligence", email: "ajohnson@run.edu.ng", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256&q=80&fit=crop&crop=face" },
  { name: "Dr. Funke Oladipo", title: "Senior Lecturer", specialty: "Data Science & Machine Learning", email: "foladipo@run.edu.ng", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&q=80&fit=crop&crop=face" },
  { name: "Dr. Emeka Nwachukwu", title: "Lecturer I", specialty: "Software Engineering", email: "enwachukwu@run.edu.ng", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=256&q=80&fit=crop&crop=face" },
  { name: "Dr. Amina Yusuf", title: "Lecturer I", specialty: "Computer Networks & Security", email: "ayusuf@run.edu.ng", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=256&q=80&fit=crop&crop=face" },
  { name: "Mr. Samuel Okonkwo", title: "Lecturer II", specialty: "Web Technologies", email: "sokonkwo@run.edu.ng", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=256&q=80&fit=crop&crop=face" },
  { name: "Mrs. Grace Adeniyi", title: "Lecturer II", specialty: "Database Systems", email: "gadeniyi@run.edu.ng", image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=256&q=80&fit=crop&crop=face" },
];

export function StaffContent() {
  return (
    <PageTransition>
      <section className="page-hero text-center">
        <div className="relative container-custom">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-widest text-electric mb-1">
            Home / Staff
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Department Staff
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-navy-200"
          >
            The brilliant minds shaping the next generation of computer scientists.
          </motion.p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <StaggerItem key={member.name}>
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
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <BookOpen className="h-3 w-3" />
                    {member.specialty}
                  </div>
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </a>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </PageTransition>
  );
}
