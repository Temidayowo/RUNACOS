"use client";

import { motion } from "framer-motion";
import { BookOpen, FileText, Scale, Users, Shield, GraduationCap } from "lucide-react";
import { PageTransition } from "@/components/ui/MotionWrapper";

const sections = [
  {
    title: "Article I — Name & Motto",
    icon: BookOpen,
    content: `The name of the association shall be the Redeemer's University Association of Computer Science Students (RUNACOS).\n\nMotto: "Innovation Through Technology, Excellence Through Unity"`,
  },
  {
    title: "Article II — Objectives",
    icon: GraduationCap,
    content: `The objectives of the association shall be to:\n\n1. Foster academic excellence among Computer Science students.\n2. Promote unity, cooperation, and fellowship among members.\n3. Serve as a bridge between students, the department, and the university administration.\n4. Organize seminars, workshops, hackathons, and other academic activities.\n5. Encourage innovation, creativity, and technological advancement.\n6. Represent the interests and welfare of Computer Science students.`,
  },
  {
    title: "Article III — Membership",
    icon: Users,
    content: `1. Membership of RUNACOS is open to all registered students of the Department of Computer Science, Redeemer's University.\n2. Membership is obtained upon payment of the prescribed association dues and registration.\n3. Every member shall be issued a unique Membership ID and a membership card.\n4. Membership is valid for the current academic session and must be renewed annually.`,
  },
  {
    title: "Article IV — Executive Council",
    icon: Shield,
    content: `The Executive Council shall consist of:\n\n1. President\n2. Vice President\n3. General Secretary\n4. Assistant General Secretary\n5. Financial Secretary\n6. Treasurer\n7. Public Relations Officer (PRO)\n8. Social Director\n9. Sports Director\n10. Welfare Director\n\nElections shall be held annually, and all executive positions are open to members in good standing.`,
  },
  {
    title: "Article V — Dues & Finances",
    icon: Scale,
    content: `1. The association dues shall be determined by the Executive Council at the beginning of each academic session.\n2. All financial records shall be kept by the Financial Secretary and audited by the Treasurer.\n3. No expenditure shall be made without the approval of the Executive Council.\n4. A financial report shall be presented at every general meeting.`,
  },
  {
    title: "Article VI — Meetings",
    icon: FileText,
    content: `1. General meetings shall be held at least once every month during the academic session.\n2. Emergency meetings may be called by the President or by a petition signed by at least one-third of the members.\n3. Quorum for a general meeting shall be one-third of the total membership.\n4. Decisions shall be by simple majority vote.`,
  },
];

export default function ConstitutionPage() {
  return (
    <PageTransition>
      {/* Header */}
      <section className="bg-white py-16 md:py-20 text-center">
        <div className="container-custom">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-3"
          >
            Our Constitution
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            RUNACOS Constitution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-lg text-gray-500"
          >
            The guiding principles and rules that govern the Redeemer&apos;s
            University Association of Computer Science Students.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                    <section.icon className="h-5 w-5 text-navy-600" />
                  </div>
                  <h2 className="font-serif text-lg font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {section.content}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-center"
            >
              <p className="text-sm text-blue-700">
                This is a summary of the RUNACOS constitution. For the full
                document, please contact the General Secretary or visit the
                departmental office.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
