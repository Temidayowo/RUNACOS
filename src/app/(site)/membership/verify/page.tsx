"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  CreditCard,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { MembershipCard } from "@/components/membership/MembershipCard";

interface MemberData {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  level: string;
  passportUrl: string;
  paidAt: string | null;
  paymentStatus: string;
  gender?: string;
  department?: string;
  faculty?: string;
  stateOfOrigin?: string;
  academicSession?: string;
  semester?: string;
  badgeTemplateUrl?: string;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [member, setMember] = useState<MemberData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/membership/verify/${reference}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setMember(data.data);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [reference]);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `RUNACOS-Card-${member?.memberId || "card"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Download failed. Please take a screenshot of your card.");
    }
  };

  return (
    <PageTransition>
      <section className="flex min-h-[70vh] items-center justify-center py-16 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-xl text-center">
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <Loader2 className="h-12 w-12 text-navy-600 animate-spin" />
                <h2 className="font-heading text-xl font-bold text-gray-900">
                  Verifying Payment...
                </h2>
                <p className="text-gray-500">
                  Please wait while we confirm your payment with Paystack.
                </p>
              </motion.div>
            )}

            {status === "failed" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900">
                  Payment Verification Failed
                </h2>
                <p className="text-gray-500">
                  We couldn&apos;t verify your payment. This could be because the
                  payment was not completed or the reference is invalid.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link href="/membership" className="btn-primary">
                    Try Again
                  </Link>
                  <Link href="/" className="btn-secondary">
                    Go Home
                  </Link>
                </div>
              </motion.div>
            )}

            {status === "success" && member && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50"
                >
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </motion.div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    Payment Verified!
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Your association dues have been paid. Your membership card is now available.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 p-4"
                >
                  <p className="text-xs text-gray-500 mb-1">Your Membership ID</p>
                  <span className="font-mono text-xl font-bold text-navy-800">
                    {member.memberId}
                  </span>
                </motion.div>

                {/* Membership Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full"
                >
                  <div ref={cardRef}>
                    <MembershipCard
                      firstName={member.firstName}
                      lastName={member.lastName}
                      matricNumber={member.matricNumber}
                      level={member.level}
                      memberId={member.memberId}
                      passportUrl={member.passportUrl}
                      paidAt={member.paidAt}
                      department={member.department}
                      faculty={member.faculty}
                      academicSession={member.academicSession}
                      semester={member.semester}
                      badgeTemplateUrl={member.badgeTemplateUrl}
                    />
                  </div>
                </motion.div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadCard}
                    className="btn-primary gap-2"
                  >
                    <Download className="h-4 w-4" /> Download Card
                  </motion.button>
                  <Link href="/" className="btn-secondary gap-2">
                    <CreditCard className="h-4 w-4" /> Go to Homepage
                  </Link>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
                  <Mail className="h-4 w-4" />
                  <span>A confirmation email has been sent to {member.email}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-surface-1">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
