"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-0">
      {/* Left Panel — Dark CS-themed visual */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-hero text-white flex-col justify-center items-center p-12 relative overflow-hidden"
      >
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-grid-dots-light opacity-30 pointer-events-none" />

        {/* Floating code symbols */}
        <motion.div
          animate={{ y: [-12, 12, -12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[12%] left-[10%] text-white/[0.06] font-mono text-8xl font-bold select-none"
        >
          {"</>"}
        </motion.div>
        <motion.div
          animate={{ y: [10, -15, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[12%] text-white/[0.05] font-mono text-7xl font-bold select-none"
        >
          {"{ }"}
        </motion.div>
        <motion.div
          animate={{ y: [-8, 16, -8] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[30%] left-[20%] text-white/[0.04] font-mono text-6xl font-bold select-none"
        >
          {"λ"}
        </motion.div>
        <motion.div
          animate={{ y: [6, -10, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[18%] text-white/[0.04] font-mono text-5xl font-bold select-none"
        >
          01
        </motion.div>

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-electric/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8"
          >
            <Image src="/logo.png" alt="RUNACOS" width={48} height={48} className="object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </motion.div>

          <h1 className="text-3xl font-bold font-heading mb-3 tracking-tight">RUNACOS</h1>
          <p className="text-sm text-navy-200 mb-8 leading-relaxed">
            Redeemer&apos;s University Association of Computer Science Students
          </p>

          <div className="h-px w-16 bg-gradient-to-r from-electric to-cyan mx-auto mb-8" />

          <p className="text-white/40 text-sm font-mono tracking-wide">
            &quot;Where Code Meets Community&quot;
          </p>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Image src="/logo.png" alt="RUNACOS" width={32} height={32} className="object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <h2 className="text-lg font-bold font-heading text-navy-800">RUNACOS</h2>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-heading text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@runacos.org"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-electric focus:ring-electric/30"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-navy-800 text-white py-3 rounded-xl font-medium hover:bg-navy-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400 font-mono">
            RUNACOS Admin Portal v1.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
