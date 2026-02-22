"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { MembershipCard } from "@/components/membership/MembershipCard";

interface CardData {
  memberId: string;
  firstName: string;
  lastName: string;
  matricNumber: string;
  level: string;
  passportUrl: string;
  paidAt: string | null;
}

export default function CardPage() {
  const params = useParams();
  const memberId = params.memberId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<CardData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/membership/card/${memberId}`);
        const json = await res.json();
        if (res.ok && json.data) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to load card");
        }
      } catch {
        setError("Failed to load card");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [memberId]);

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
      link.download = `RUNACOS-Card-${data?.memberId || "card"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Download failed. Please take a screenshot of your card.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16">
          <AlertCircle className="h-12 w-12 text-red-400" />
          <h2 className="font-heading text-xl font-bold text-gray-900">
            {error || "Card not found"}
          </h2>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-2xl font-bold text-gray-900 mb-8"
            >
              Your Membership Card
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div ref={cardRef}>
                <MembershipCard
                  firstName={data.firstName}
                  lastName={data.lastName}
                  matricNumber={data.matricNumber}
                  level={data.level}
                  memberId={data.memberId}
                  passportUrl={data.passportUrl}
                  paidAt={data.paidAt}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <button onClick={downloadCard} className="btn-primary gap-2">
                <Download className="h-4 w-4" /> Download Card
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
