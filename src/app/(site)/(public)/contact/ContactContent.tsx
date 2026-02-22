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
  { icon: MapPin, label: "Address", value: "Department of Computer Science,\nCollege of Natural Sciences,\nRedeemer's University, Ede, Osun State" },
  { icon: Mail, label: "Email", value: "info@runacos.org", href: "mailto:info@runacos.org" },
  { icon: Phone, label: "Phone", value: "+234 800 RUNACOS", href: "tel:+2348001234567" },
  { icon: Clock, label: "Office Hours", value: "Monday - Friday\n9:00 AM - 5:00 PM" },
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
      {/* Header */}
      <section className="bg-white py-16 md:py-20 text-center">
        <div className="container-custom">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl font-extrabold text-gray-900 sm:text-5xl"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-lg text-gray-500"
          >
            Have questions, feedback, or want to collaborate? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            {/* Form */}
            <AnimateOnScroll variants={slideLeft}>
              {sent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-12 text-center"
                >
                  <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                  <h3 className="font-serif text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="mt-2 text-gray-500">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="btn-primary mt-6">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What is this about?"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us more..."
                      className="input-field resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="btn-primary gap-2 px-8 py-3"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Sending..." : "Send Message"}
                  </motion.button>
                </form>
              )}
            </AnimateOnScroll>

            {/* Contact Info */}
            <AnimateOnScroll variants={slideRight}>
              <div className="space-y-6">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50">
                      <item.icon className="h-5 w-5 text-navy-800" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.label}</h4>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-blue-600 hover:underline whitespace-pre-line">{item.value}</a>
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
