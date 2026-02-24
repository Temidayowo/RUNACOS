"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Copy,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

const steps = ["Personal Info", "Fault Details", "Review & Submit"];

interface FaultCategory {
  id: string;
  name: string;
  description?: string;
}

export function ReportFaultContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [categories, setCategories] = useState<FaultCategory[]>([]);
  const [fileName, setFileName] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    categoryId: "",
    description: "",
    fileUrl: "",
  });

  // Fetch categories from the API
  useEffect(() => {
    fetch("/api/frms/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => console.error("Failed to load categories"));
  }, []);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    if (currentStep === 0) return form.name && form.email;
    if (currentStep === 1) return form.location && form.categoryId && form.description;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/frms/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setReferenceId(data.data.referenceId);
        setEmailSent(!!data.emailSent);
        if (data.emailSent) {
          toast.success(`Report submitted! Confirmation email sent to your address with tracking code: ${data.data.referenceId}`);
        } else {
          toast.success(`Report submitted! Your tracking code is: ${data.data.referenceId} (email unavailable)`);
        }
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyRefId = () => {
    if (referenceId) {
      navigator.clipboard.writeText(referenceId);
      toast.success("Reference ID copied!");
    }
  };

  // Success State
  if (referenceId) {
    return (
      <PageTransition>
        <section className="flex min-h-[70vh] items-center justify-center py-16 bg-surface-1">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mx-auto max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50"
            >
              <CheckCircle className="h-10 w-10 text-green-500" />
            </motion.div>

            <h2 className="font-heading text-2xl font-bold text-gray-900">
              Report Submitted!
            </h2>
            <p className="mt-2 text-gray-500">
              Your fault report has been received.
              {emailSent
                ? " A confirmation email has been sent to your address."
                : " Use the reference ID below to track your report status."}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 p-4"
            >
              <p className="text-xs text-gray-500 mb-1">Your Reference ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl font-bold text-navy-800">
                  {referenceId}
                </span>
                <button
                  onClick={copyRefId}
                  className="rounded-lg p-1.5 hover:bg-navy-100 transition-colors"
                >
                  <Copy className="h-4 w-4 text-navy-600" />
                </button>
              </div>
            </motion.div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/frms/track/${referenceId}`}
                className="btn-primary gap-2"
              >
                <Search className="h-4 w-4" /> Track My Report
              </Link>
              <button
                onClick={() => {
                  setReferenceId(null);
                  setEmailSent(false);
                  setCurrentStep(0);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    location: "",
                    categoryId: "",
                    description: "",
                    fileUrl: "",
                  });
                }}
                className="btn-secondary"
              >
                Submit Another
              </button>
            </div>
          </motion.div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHero
        slug="frms-report"
        defaultHeading="Report a Fault"
        defaultSubheading="Submit maintenance and facility issues for quick resolution by our team."
        breadcrumb="Home / FRMS / Report"
      />

      {/* Form */}
      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl">
            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-10 flex items-center justify-center"
            >
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    animate={{
                      backgroundColor:
                        i <= currentStep ? "#0B2C4D" : "#E5E7EB",
                      scale: i === currentStep ? 1.1 : 1,
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium"
                  >
                    <span
                      className={
                        i <= currentStep ? "text-white" : "text-gray-400"
                      }
                    >
                      {i < currentStep ? "✓" : i + 1}
                    </span>
                  </motion.div>
                  <span
                    className={`ml-2 hidden text-sm sm:inline ${
                      i <= currentStep
                        ? "font-medium text-navy-800"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="mx-4 h-px w-8 sm:w-16">
                      <motion.div
                        animate={{
                          backgroundColor:
                            i < currentStep ? "#0B2C4D" : "#E5E7EB",
                        }}
                        className="h-full w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm sm:p-8"
              >
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Personal Information
                    </h3>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <User className="h-3.5 w-3.5" /> Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateForm("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Mail className="h-3.5 w-3.5" /> Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        placeholder="your@email.com"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Phone className="h-3.5 w-3.5" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="Optional"
                        className="input-field"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Fault Details
                    </h3>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <AlertTriangle className="h-3.5 w-3.5" /> Category *
                      </label>
                      <select
                        value={form.categoryId}
                        onChange={(e) =>
                          updateForm("categoryId", e.target.value)
                        }
                        className="input-field"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <MapPin className="h-3.5 w-3.5" /> Location *
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => updateForm("location", e.target.value)}
                        placeholder="e.g., CS Lab 1, Block B, Room 201"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <FileText className="h-3.5 w-3.5" /> Description *
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          updateForm("description", e.target.value)
                        }
                        placeholder="Describe the fault in detail..."
                        rows={5}
                        className="input-field resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Upload className="h-3.5 w-3.5" /> Attachment (Optional)
                      </label>
                      {form.fileUrl ? (
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <span className="flex-1 text-sm text-green-700 truncate">{fileName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateForm("fileUrl", "");
                              setFileName("");
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="block rounded-xl border-2 border-dashed border-surface-3 p-6 text-center hover:border-electric transition-colors cursor-pointer">
                          {uploading ? (
                            <Loader2 className="mx-auto h-8 w-8 text-blue-400 animate-spin" />
                          ) : (
                            <Upload className="mx-auto h-8 w-8 text-gray-300" />
                          )}
                          <p className="mt-2 text-sm text-gray-500">
                            {uploading ? "Uploading..." : "Click to upload a file"}
                          </p>
                          <p className="text-xs text-gray-400">
                            JPG, PNG, GIF, PDF up to 5MB
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            disabled={uploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploading(true);
                              try {
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("folder", "frms");
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData,
                                });
                                const data = await res.json();
                                if (res.ok && data.data?.url) {
                                  updateForm("fileUrl", data.data.url);
                                  setFileName(file.name);
                                  toast.success("File uploaded");
                                } else {
                                  toast.error(data.error || "Upload failed");
                                }
                              } catch {
                                toast.error("Upload failed");
                              } finally {
                                setUploading(false);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Review Your Report
                    </h3>
                    <div className="space-y-3 rounded-xl bg-surface-1 p-4">
                      {[
                        { label: "Name", value: form.name },
                        { label: "Email", value: form.email },
                        { label: "Phone", value: form.phone || "Not provided" },
                        { label: "Category", value: categories.find((c) => c.id === form.categoryId)?.name || form.categoryId },
                        { label: "Location", value: form.location },
                        { label: "Description", value: form.description },
                        ...(form.fileUrl ? [{ label: "Attachment", value: fileName || "File attached" }] : []),
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs font-medium text-gray-400">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-700">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className={`btn-ghost gap-1 ${
                  currentStep === 0 ? "invisible" : ""
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </motion.button>

              {currentStep < 2 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className="btn-primary gap-1"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {loading ? "Submitting..." : "Submit Report"}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
