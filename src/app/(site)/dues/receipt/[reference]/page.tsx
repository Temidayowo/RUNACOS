"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { DuesReceipt } from "@/components/dues/DuesReceipt";

interface ReceiptData {
  memberName: string;
  memberId: string;
  matricNumber: string;
  department: string | null;
  academicSession: string;
  amount: number;
  paymentRef: string;
  paymentStatus: string;
  paidAt: string | null;
}

export default function ReceiptPage() {
  const params = useParams();
  const reference = params.reference as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReceiptData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/dues/receipt/${reference}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          const p = res.data;
          setData({
            memberName: `${p.member.firstName} ${p.member.lastName}`,
            memberId: p.member.memberId,
            matricNumber: p.member.matricNumber,
            department: p.member.department,
            academicSession: p.academicSession,
            amount: p.amount,
            paymentRef: p.paymentRef,
            paymentStatus: p.paymentStatus,
            paidAt: p.verifiedAt,
          });
        }
      })
      .catch(() => toast.error("Failed to load receipt"))
      .finally(() => setLoading(false));
  }, [reference]);

  const handleDownload = useCallback(async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `RUNACOS-Receipt-${reference}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Receipt downloaded");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  }, [reference]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-surface-1">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
        </div>
      </PageTransition>
    );
  }

  if (!data) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-1 gap-4">
          <p className="text-gray-500">Receipt not found</p>
          <Link href="/dues/pay" className="btn-primary text-sm">
            Go to Pay Dues
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="py-12 md:py-20 bg-surface-1 min-h-screen">
        <div className="container-custom">
          <div className="mx-auto max-w-xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link
                href="/dues/pay"
                className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Pay Dues
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DuesReceipt ref={receiptRef} {...data} />

              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-primary gap-2"
                >
                  {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloading ? "Generating..." : "Download Receipt"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
