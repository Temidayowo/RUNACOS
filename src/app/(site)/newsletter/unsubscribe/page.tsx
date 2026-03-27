"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
      } else {
        toast.error(data.error || "Failed to unsubscribe");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface-1 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {done ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Unsubscribed</h1>
            <p className="mt-2 text-gray-500">
              You've been removed from our mailing list. You won't receive further emails from RUNACOS.
            </p>
            <Link href="/" className="btn-primary mt-6 inline-flex">
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Unsubscribe</h1>
            <p className="mt-2 text-gray-500">
              Enter your email address below to unsubscribe from RUNACOS emails.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field text-center font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Processing..." : "Unsubscribe"}
              </button>
            </form>
            <Link href="/" className="mt-4 inline-block text-sm text-gray-400 hover:text-gray-600">
              Cancel, take me back
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
