"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  CreditCard,
  CheckCircle,
  User,
  Hash,
  Calendar,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";
import { computeLevel } from "@/lib/level";

interface MemberInfo {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  level: string;
  admissionYear: number | null;
}

interface PastPayment {
  id: string;
  academicSession: string;
  amount: number;
  paymentStatus: string;
  paymentRef: string;
  createdAt: string;
}

export default function PayDuesPage() {
  const [lookup, setLookup] = useState("");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [pastPayments, setPastPayments] = useState<PastPayment[]>([]);
  const [currentSession, setCurrentSession] = useState("");
  const [duesAmount, setDuesAmount] = useState(0);
  const [alreadyPaid, setAlreadyPaid] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.academic_session) setCurrentSession(data.data.academic_session);
        if (data.data?.dues_amount) setDuesAmount(parseInt(data.data.dues_amount));
      })
      .catch(() => {});
  }, []);

  const handleLookup = async () => {
    if (!lookup.trim()) {
      toast.error("Enter your email or matric number");
      return;
    }
    setLoading(true);
    setMember(null);
    setPastPayments([]);
    setAlreadyPaid(false);

    try {
      const isEmail = lookup.includes("@");
      const params = new URLSearchParams(isEmail ? { email: lookup } : { matricNumber: lookup });

      // Try to look up the member via dues endpoint
      const duesRes = await fetch(`/api/dues?${params}&limit=50`);
      const duesData = await duesRes.json();

      if (duesRes.ok && duesData.data?.length > 0) {
        const firstPayment = duesData.data[0];
        setMember({
          id: firstPayment.member.id,
          memberId: firstPayment.member.memberId,
          firstName: firstPayment.member.firstName,
          lastName: firstPayment.member.lastName,
          email: firstPayment.member.email,
          matricNumber: firstPayment.member.matricNumber,
          level: firstPayment.member.level,
          admissionYear: firstPayment.member.admissionYear,
        });
        setPastPayments(duesData.data);

        // Check if current session is paid
        const currentPaid = duesData.data.find(
          (p: PastPayment) => p.academicSession === currentSession && p.paymentStatus === "VERIFIED"
        );
        setAlreadyPaid(!!currentPaid);
      } else {
        // No past payments — try to find member via membership check
        const checkRes = await fetch("/api/membership/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEmail ? { email: lookup } : { matricNumber: lookup }),
        });
        const checkData = await checkRes.json();

        if (checkData.data?.hasDuplicate) {
          // Member exists but no payments yet, lookup member details
          const memberRes = await fetch(`/api/members?search=${encodeURIComponent(lookup)}&limit=1`);
          const memberData = await memberRes.json();
          if (memberData.data?.length > 0) {
            const m = memberData.data[0];
            setMember({
              id: m.id,
              memberId: m.memberId,
              firstName: m.firstName,
              lastName: m.lastName,
              email: m.email,
              matricNumber: m.matricNumber,
              level: m.level,
              admissionYear: m.admissionYear,
            });
          } else {
            toast.error("Member not found. Please register first.");
          }
        } else {
          toast.error("Member not found. Please register first.");
        }
      }
    } catch {
      toast.error("Lookup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!member) return;
    setPaying(true);
    try {
      const res = await fetch("/api/dues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Payment initiation failed");
        return;
      }

      // Redirect to Paystack
      if (data.data?.paystack?.authorizationUrl) {
        window.location.href = data.data.paystack.authorizationUrl;
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPaying(false);
    }
  };

  const computedLevel = member?.admissionYear && currentSession
    ? computeLevel(member.admissionYear, currentSession)
    : member?.level || "N/A";

  return (
    <PageTransition>
      <PageHero
        slug="dues-pay"
        defaultHeading="Pay Association Dues"
        defaultSubheading="Pay your RUNACOS membership dues for the current academic session."
        breadcrumb="Home / Pay Dues"
      />

      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-xl">
            {/* Lookup Form */}
            {!member && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-surface-3 bg-surface-0 p-6 sm:p-8"
              >
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                  Find Your Account
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your registered email address or matric number to look up your account.
                </p>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={lookup}
                      onChange={(e) => setLookup(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                      placeholder="Email address or matric number"
                      className="input-field pl-10"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLookup}
                    disabled={loading}
                    className="btn-primary w-full gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {loading ? "Searching..." : "Look Up"}
                  </motion.button>
                </div>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Not registered yet?{" "}
                  <Link href="/membership" className="text-electric hover:underline">
                    Register here
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Member Found */}
            {member && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Member Info Card */}
                <div className="rounded-xl border border-surface-3 bg-surface-0 p-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">
                    Member Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: User, label: "Name", value: `${member.firstName} ${member.lastName}` },
                      { icon: Hash, label: "Member ID", value: member.memberId },
                      { icon: Hash, label: "Matric No", value: member.matricNumber },
                      { icon: GraduationCap, label: "Level", value: `${computedLevel} Level` },
                      { icon: Calendar, label: "Session", value: currentSession || "N/A" },
                      { icon: CreditCard, label: "Dues Amount", value: `\u20A6${duesAmount.toLocaleString()}` },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="flex items-center gap-1 text-xs text-gray-400">
                          <item.icon className="h-3 w-3" /> {item.label}
                        </p>
                        <p className="text-sm font-medium text-gray-900 font-mono">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                {alreadyPaid ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                    <CheckCircle className="mx-auto h-10 w-10 text-emerald-500 mb-3" />
                    <h3 className="font-heading font-bold text-emerald-800">
                      Dues Paid for {currentSession}
                    </h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      You&apos;ve already paid your dues for this session.
                    </p>
                    <Link
                      href={`/dues/receipt/${pastPayments.find((p) => p.academicSession === currentSession && p.paymentStatus === "VERIFIED")?.paymentRef || ""}`}
                      className="mt-4 inline-flex btn-primary text-sm gap-2"
                    >
                      View Receipt
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-xl border border-surface-3 bg-surface-0 p-6 text-center">
                    <CreditCard className="mx-auto h-10 w-10 text-electric mb-3" />
                    <h3 className="font-heading font-bold text-gray-900">
                      Pay Dues for {currentSession}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      Amount: <span className="font-mono font-bold text-gray-900">{"\u20A6"}{duesAmount.toLocaleString()}</span>
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayNow}
                      disabled={paying}
                      className="btn-primary gap-2"
                    >
                      {paying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      {paying ? "Redirecting to Paystack..." : "Pay Now"}
                    </motion.button>
                  </div>
                )}

                {/* Past Payments */}
                {pastPayments.length > 0 && (
                  <div className="rounded-xl border border-surface-3 bg-surface-0 p-6">
                    <h3 className="font-heading font-semibold text-gray-900 mb-3">
                      Payment History
                    </h3>
                    <div className="space-y-2">
                      {pastPayments.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between rounded-lg bg-surface-1 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">{p.academicSession}</p>
                            <p className="text-xs font-mono text-gray-400">{p.paymentRef}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono font-medium text-gray-900">
                              {"\u20A6"}{p.amount.toLocaleString()}
                            </p>
                            <span
                              className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                                p.paymentStatus === "VERIFIED"
                                  ? "bg-green-100 text-green-700"
                                  : p.paymentStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {p.paymentStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Switch Account */}
                <button
                  onClick={() => { setMember(null); setPastPayments([]); setLookup(""); }}
                  className="text-sm text-electric hover:underline mx-auto block"
                >
                  Look up a different account
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
