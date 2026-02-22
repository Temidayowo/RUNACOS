"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { FOOTER_QUICK_LINKS, FOOTER_RESOURCES } from "@/lib/constants";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

export function Footer() {
  const pathname = usePathname();

  // Don't render footer on admin pages
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <AnimateOnScroll variants={fadeUp} delay={0}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700">
                  <span className="text-lg font-bold text-white">R</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">RUNACOS</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 mb-6">
                The official Association of Computer Science Students at
                Redeemer&apos;s University, fostering innovation, academic
                excellence, and technological advancement.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.1, backgroundColor: "#2563EB" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-gray-300 transition-colors hover:text-white"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Quick Links */}
          <AnimateOnScroll variants={fadeUp} delay={0.1}>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Resources */}
          <AnimateOnScroll variants={fadeUp} delay={0.2}>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_RESOURCES.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Contact */}
          <AnimateOnScroll variants={fadeUp} delay={0.3}>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <span className="text-sm text-gray-400">
                    Department of Computer Science,
                    <br />
                    College of Natural Sciences,
                    <br />
                    Redeemer&apos;s University, Ede
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                  <a
                    href="mailto:info@runacos.org"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    info@runacos.org
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                  <a
                    href="tel:+2348001234567"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    +234 800 RUNACOS
                  </a>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-700">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} RUNACOS. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
