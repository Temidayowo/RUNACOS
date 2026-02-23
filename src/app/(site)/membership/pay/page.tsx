"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

interface MemberInfo {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  level: string;
  department: string | null;
  passportUrl: string;
  paymentStatus: string;
}

export default function PayDuesPage() {
  const [lookupValue, setLookupValue] = useState("");
  const [lookupType, setLookupType] = useState<"email" | "matricNumber">("email");
  const [searching, setSearching] = useState(false);
  const [paying, setPaying] = useState(false);
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [error, setError] = useState("");
  const [fee, setFee] = useState(5000);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.membership_fee) {
          setFee(parseInt(data.data.membership_fee));
        }
      })
      .catch(() => {});
  }, []);

  const handleLookup = async () => {
    if (!lookupValue.trim()) {
      toast.error("Please enter your email or matric number");
      return;
    }

    setSearching(true);
    setError("");
    setMember(null);

    try {
      const params = new URLSearchParams({ [lookupType]: lookupValue.trim() });
      const res = await fetch(`/api/membership/pay?${params}`);
      const data = await res.json();

      if (res.ok && data.data) {
        setMember(data.data);
      } else {
        setError(data.error || "Member not found");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handlePayment = async () => {
    if (!member) return;

    setPaying(true);
    try {
      // Initiate payment - generates reference and links to member
      const payRes = await fetch("/api/membership/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [lookupType]: lookupValue.trim() }),
      });
      const payData = await payRes.json();

      if (payData.data?.alreadyPaid) {
        toast.success("Your dues are already paid!");
        setMember((prev) => prev ? { ...prev, paymentStatus: "VERIFIED" } : null);
        setPaying(false);
        return;
      }

      if (!payRes.ok) {
        toast.error(payData.error || "Failed to initiate payment");
        setPaying(false);
        return;
      }

      // Initialize Paystack
      const paystackRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payData.data.email,
          amount: payData.data.amount,
          reference: payData.data.paymentRef,
        }),
      });
      const paystackData = await paystackRes.json();

      if (paystackRes.ok && paystackData.data?.authorizationUrl) {
        window.location.href = paystackData.data.authorizationUrl;
      } else {
        toast.error(paystackData.error || "Payment initialization failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPaying(false);
    }
  };

  return (
    <PageTransition>
      <PageHero
        slug="membership"
        defaultHeading="Pay Association Dues"
        defaultSubheading="Pay your RUNACOS association dues to unlock your membership card and full member benefits."
        breadcrumb="Home / Membership / Pay Dues"
      />

      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-lg">
            {/* Lookup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm sm:p-8"
            >
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                Find Your Account
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Enter your registered email or matric number to look up your membership.
              </p>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setLookupType("email"); setLookupValue(""); setMember(null); setError(""); }}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      lookupType === "email"
                        ? "bg-navy-800 text-white"
                        : "bg-surface-1 text-gray-600 hover:bg-surface-2"
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5 inline mr-1.5" />
                    Email
                  </button>
                  <button
                    onClick={() => { setLookupType("matricNumber"); setLookupValue(""); setMember(null); setError(""); }}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      lookupType === "matricNumber"
                        ? "bg-navy-800 text-white"
                        : "bg-surface-1 text-gray-600 hover:bg-surface-2"
                    }`}
                  >
                    <Hash className="h-3.5 w-3.5 inline mr-1.5" />
                    Matric Number
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={lookupType === "email" ? "email" : "text"}
                    value={lookupValue}
                    onChange={(e) => { setLookupValue(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    placeholder={lookupType === "email" ? "your@email.com" : "RUN/COS/21/0001"}
                    className="input-field pr-12"
                  />
                  <button
                    onClick={handleLookup}
                    disabled={searching || !lookupValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-navy-800 p-2 text-white hover:bg-navy-700 disabled:opacity-50 transition-colors"
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <p>{error}</p>
                      {error.includes("not found") && (
                        <Link href="/membership" className="mt-1 inline-block text-xs font-medium text-red-600 underline">
                          Register as a member first
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Member Details */}
            {member && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm sm:p-8"
              >
                {member.paymentStatus === "VERIFIED" ? (
                  <div className="text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-gray-900">
                        Dues Already Paid
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Your association dues have been paid. You can view your membership card.
                      </p>
                    </div>
                    <Link
                      href={`/membership/card/${member.memberId}`}
                      className="btn-primary inline-flex gap-2"
                    >
                      <CreditCard className="h-4 w-4" /> View Membership Card
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.passportUrl}
                          alt="Passport"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">{member.memberId}</p>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {member.matricNumber} &middot; {member.level} Level
                          {member.department ? ` &middot; ${member.department}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-navy-100 bg-navy-50 p-4 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-navy-700">
                          Association Dues
                        </span>
                        <span className="text-xl font-bold text-navy-800">
                          &#8358;{fee.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-navy-600">
                        One-time payment per academic session
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={paying}
                      className="btn-primary w-full gap-2 justify-center"
                    >
                      {paying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      {paying ? "Processing..." : `Pay \u20A6${fee.toLocaleString()}`}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}

            {/* Not a member yet? */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500">
                Not a member yet?{" "}
                <Link href="/membership" className="font-medium text-electric hover:underline">
                  Register for free
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
