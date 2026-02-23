"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { NAV_LINKS, NAV_RESOURCES } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const isHomePage = pathname === "/";
  const isTransparentHero = isHomePage || pathname === "/membership";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navbarBg = isScrolled
    ? "backdrop-blur-xl bg-white/80 border-b border-surface-3/50 shadow-sm"
    : isTransparentHero
      ? "bg-transparent"
      : "bg-white border-b border-surface-3/50";

  const textColor = isScrolled || !isTransparentHero
    ? "text-gray-700"
    : "text-white/90";

  const logoColor = isScrolled || !isTransparentHero
    ? "text-navy-800"
    : "text-white";

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${navbarBg}`}
      >
        <div className="container-custom flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                isScrolled || !isTransparentHero
                  ? "bg-navy-800/10 group-hover:bg-navy-800/20"
                  : "bg-white/15 backdrop-blur-sm group-hover:bg-white/25"
              }`}
            >
              <div
                className={`h-6 w-6 transition-colors duration-300 ${
                  isScrolled || !isTransparentHero ? "bg-navy-800" : "bg-white"
                }`}
                role="img"
                aria-label="RUNACOS logo"
                style={{
                  WebkitMaskImage: "url(/logo.png)",
                  maskImage: "url(/logo.png)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
            </motion.div>
            <div className="hidden sm:block">
              <div className={`text-sm font-bold leading-tight font-heading ${logoColor}`}>
                Redeemer&apos;s University
              </div>
              <div className={`text-[10px] font-mono uppercase tracking-wider leading-tight ${
                isScrolled || !isTransparentHero ? "text-gray-400" : "text-white/50"
              }`}>
                Association of Computing Students
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link, i) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
                      isActive
                        ? isScrolled || !isTransparentHero
                          ? "text-navy-800"
                          : "text-white"
                        : `${textColor} hover:${isScrolled || !isTransparentHero ? "text-navy-800" : "text-white"}`
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-electric"
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/* Resources Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + NAV_LINKS.length * 0.04 }}
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${textColor} hover:${isScrolled || !isTransparentHero ? "text-navy-800" : "text-white"}`}
              >
                Resources
                <ChevronDown className={`h-3 w-3 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 rounded-xl border border-surface-3 bg-white py-2 shadow-lg"
                  >
                    {NAV_RESOURCES.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-surface-1 hover:text-navy-800 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/membership"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-accent px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:shadow-glow-blue hover:scale-[1.02] active:scale-[0.98]"
              >
                Membership
                <ChevronRight className="h-3 w-3" />
              </Link>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                isScrolled || !isTransparentHero
                  ? "text-gray-600 hover:bg-surface-2"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu — Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-midnight/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl"
            >
              <div className="flex h-[72px] items-center justify-between px-6 border-b border-surface-3">
                <span className="font-heading font-bold text-navy-800">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-2 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <nav className="flex flex-col px-4 py-4">
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname?.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-electric/5 text-electric"
                            : "text-gray-600 hover:bg-surface-1 hover:text-navy-800"
                        }`}
                      >
                        {link.label}
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-electric" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Resources section in mobile menu */}
                <div className="mt-4 px-4">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                    Resources
                  </p>
                </div>
                {NAV_RESOURCES.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-surface-1 hover:text-navy-800 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 px-4"
                >
                  <Link
                    href="/membership"
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-accent px-5 py-3 text-sm font-medium text-white shadow-sm"
                  >
                    Become a Member
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </nav>

              {/* Bottom section */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-surface-3 px-8 py-4">
                <p className="text-[10px] font-mono text-gray-400 tracking-wider">
                  RUNACOS v1.0.0
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
