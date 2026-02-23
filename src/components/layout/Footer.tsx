"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Twitter, Instagram, Linkedin, Mail, MapPin, Clock } from "lucide-react";
import { FOOTER_QUICK_LINKS, FOOTER_RESOURCES, FOOTER_CONNECT, SITE_VERSION } from "@/lib/constants";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-navy-900 text-gray-300 overflow-hidden">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-grid-dots-light pointer-events-none opacity-30" />

      <div className="relative container-custom pt-16 pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <AnimateOnScroll variants={fadeUp} delay={0} className="lg:col-span-4">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.png" alt="RUNACOS" className="h-7 w-7 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-heading tracking-wide">
                    RUNACOS
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-navy-300">
                    Redeemer&apos;s University
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-navy-200 mb-6 max-w-xs">
                The official Association of Computer Science Students —
                fostering innovation, academic excellence, and technological
                advancement.
              </p>
              <div className="flex gap-2.5">
                {[
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:info@runacos.org", label: "Email" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-navy-300 transition-all duration-200 hover:bg-electric hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Quick Links */}
          <AnimateOnScroll variants={fadeUp} delay={0.1} className="lg:col-span-2">
            <div>
              <h4 className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-white/60">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-200 transition-colors hover:text-white link-hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Resources */}
          <AnimateOnScroll variants={fadeUp} delay={0.15} className="lg:col-span-2">
            <div>
              <h4 className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-white/60">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_RESOURCES.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-200 transition-colors hover:text-white link-hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Contact */}
          <AnimateOnScroll variants={fadeUp} delay={0.2} className="lg:col-span-4">
            <div>
              <h4 className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-white/60">
                Get in Touch
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-electric/10">
                    <MapPin className="h-3.5 w-3.5 text-electric" />
                  </div>
                  <span className="text-sm text-navy-200">
                    Department of Computer Science,<br />
                    Redeemer&apos;s University, Ede
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-electric/10">
                    <Mail className="h-3.5 w-3.5 text-electric" />
                  </div>
                  <a
                    href="mailto:info@runacos.org"
                    className="text-sm font-mono text-navy-200 hover:text-white transition-colors"
                  >
                    info@runacos.org
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-electric/10">
                    <Clock className="h-3.5 w-3.5 text-electric" />
                  </div>
                  <span className="text-sm text-navy-200">
                    Mon - Fri: <span className="font-mono">9:00 AM - 5:00 PM</span>
                  </span>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Membership Notice */}
        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10">
              <span className="text-electric text-sm font-bold font-mono">&#8358;</span>
            </div>
            <div>
              <p className="text-xs font-mono font-semibold text-white/80">Become a Member</p>
              <p className="text-[11px] text-navy-300">Registration is free. Pay association dues to get your membership card.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/membership"
              className="text-xs font-medium text-electric hover:text-white transition-colors whitespace-nowrap link-hover-underline"
            >
              Register Free &rarr;
            </Link>
            <Link
              href="/membership/pay"
              className="text-xs font-medium text-navy-300 hover:text-white transition-colors whitespace-nowrap link-hover-underline"
            >
              Pay Dues &rarr;
            </Link>
          </div>
        </div>

        {/* Circuit-trace divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-navy-600/30 to-transparent" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} RUNACOS &middot; Redeemer&apos;s University
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-navy-400 hover:text-navy-200 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-navy-400 hover:text-navy-200 transition-colors"
            >
              Terms
            </Link>
            <span className="text-[10px] font-mono text-navy-500">
              v{SITE_VERSION}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
