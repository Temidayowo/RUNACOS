"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AnimateOnScroll,
  slideLeft,
  slideRight,
  PageTransition,
} from "@/components/ui/MotionWrapper";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "Department of Computer Science,\nRedeemer's University, Ede, Osun State", href: undefined },
  { icon: Mail, label: "Email", value: "info@runacos.org", href: "mailto:info@runacos.org" },
  { icon: Phone, label: "Phone", value: "+234 800 RUNACOS", href: "tel:+2348001234567" },
  { icon: Clock, label: "Office Hours", value: "Monday - Friday\n9:00 AM - 5:00 PM", href: undefined },
];

export function ContactContent() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      {/* Page Hero */}
      <section className="page-hero text-center">
        <div className="relative container-custom">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-widest text-electric mb-1">
            Home / Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-lg text-navy-200"
          >
            We&apos;d love to hear from you. Drop us a message.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-surface-1">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <AnimateOnScroll variants={slideLeft}>
              <div className="rounded-2xl border border-surface-3 bg-surface-0 p-6 sm:p-8">
                {sent ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="mt-2 text-gray-500">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                    <button onClick={() => setSent(false)} className="btn-primary mt-6">
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="input-field" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" className="input-field" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." className="input-field resize-none" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="btn-accent gap-2 px-8 py-3"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {loading ? "Sending..." : "Send Message"}
                    </motion.button>
                  </form>
                )}
              </div>
            </AnimateOnScroll>

            {/* Contact Info */}
            <AnimateOnScroll variants={slideRight}>
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 rounded-xl border border-surface-3 bg-surface-0 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/5">
                      <item.icon className="h-4 w-4 text-electric" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.label}</h4>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-mono text-electric hover:underline whitespace-pre-line">{item.value}</a>
                      ) : (
                        <p className="text-sm text-gray-500 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
