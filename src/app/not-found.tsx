"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-midnight relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-20" />

      {/* Floating code symbols */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[15%] font-mono text-2xl text-electric/20"
        >
          &lt;/&gt;
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 font-mono text-3xl text-cyan-400/15"
        >
          {"{ }"}
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/3 font-mono text-xl text-electric/10"
        >
          null
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[15%] font-mono text-2xl text-cyan-400/10"
        >
          404
        </motion.div>
      </div>

      <div className="text-center px-4 relative z-10">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-[120px] md:text-[150px] font-extrabold leading-none font-heading bg-gradient-to-r from-electric to-cyan bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-4">
            Page Not Found
          </h2>
          <p className="text-navy-300 max-w-md mx-auto mb-8 font-mono text-sm">
            // The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="btn-accent gap-2 px-6 py-3"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 border-[1.5px] border-white/20 text-white px-6 py-3 rounded-[10px] font-medium hover:bg-white/5 backdrop-blur-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
