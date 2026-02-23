"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Hash,
  GraduationCap,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Camera,
  X,
  AlertCircle,
  Building2,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";
import { NIGERIAN_STATES, FACULTIES, DEPARTMENTS } from "@/lib/validations/membership";

const steps = ["Personal Info", "Academic Details", "Passport Photo", "Review & Register"];

export default function MembershipPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [academicSession, setAcademicSession] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [duplicateErrors, setDuplicateErrors] = useState<Record<string, string>>({});
  const [registeredMember, setRegisteredMember] = useState<{ memberId: string } | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    stateOfOrigin: "",
    matricNumber: "",
    level: "",
    department: "",
    faculty: "",
    passportUrl: "",
    admissionYear: "",
  });

  // Fetch academic settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.academic_session) {
          setAcademicSession(data.data.academic_session);
        }
        if (data.data?.current_semester) {
          setCurrentSemester(data.data.current_semester);
        }
      })
      .catch(() => {});
  }, []);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (duplicateErrors[field]) {
      setDuplicateErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Check duplicates on blur
  const checkDuplicate = useCallback(async (field: "email" | "matricNumber", value: string) => {
    if (!value) return;
    try {
      const res = await fetch("/api/membership/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (data.data?.hasDuplicate) {
        const label = field === "email" ? "email" : "matric number";
        setDuplicateErrors((prev) => ({
          ...prev,
          [field]: `A member with this ${label} already exists`,
        }));
      }
    } catch {}
  }, []);

  const canProceed = () => {
    if (currentStep === 0) {
      return (
        form.firstName &&
        form.lastName &&
        form.email &&
        form.phone &&
        form.gender &&
        form.stateOfOrigin &&
        !duplicateErrors.email
      );
    }
    if (currentStep === 1) {
      return (
        form.matricNumber &&
        form.level &&
        form.department &&
        form.faculty &&
        form.admissionYear &&
        !duplicateErrors.matricNumber
      );
    }
    if (currentStep === 2) return !!form.passportUrl;
    return true;
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Final duplicate check
      const checkRes = await fetch("/api/membership/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, matricNumber: form.matricNumber }),
      });
      const checkData = await checkRes.json();
      if (checkData.data?.hasDuplicate) {
        const dupes = checkData.data.duplicates as string[];
        const errors: Record<string, string> = {};
        if (dupes.includes("email")) errors.email = "A member with this email already exists";
        if (dupes.includes("matricNumber")) errors.matricNumber = "A member with this matric number already exists";
        setDuplicateErrors(errors);
        setCurrentStep(dupes.includes("email") ? 0 : 1);
        toast.error("Duplicate registration detected");
        setLoading(false);
        return;
      }

      // Register member (no payment)
      const registerRes = await fetch("/api/membership/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          admissionYear: form.admissionYear ? parseInt(form.admissionYear) : undefined,
          academicSession: academicSession || undefined,
          semester: currentSemester || undefined,
        }),
      });
      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        toast.error(registerData.error || "Registration failed");
        setLoading(false);
        return;
      }

      setRegisteredMember(registerData.data);
      toast.success("Registration successful!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Registration success state
  if (registeredMember) {
    return (
      <PageTransition>
        <PageHero
          slug="membership"
          defaultHeading="Join RUNACOS"
          defaultSubheading="Become an official member of the Redeemer's University Association of Computer Science Students."
          breadcrumb="Home / Membership"
        />
        <section className="py-12 md:py-16 bg-surface-1">
          <div className="container-custom">
            <div className="mx-auto max-w-xl text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50"
                >
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </motion.div>

                <div>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    Welcome to RUNACOS!
                  </h2>
                  <p className="mt-2 text-gray-500">
                    Your membership registration is complete. You are now an official member.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-lg border-2 border-dashed border-navy-200 bg-navy-50 p-4"
                >
                  <p className="text-xs text-gray-500 mb-1">Your Membership ID</p>
                  <span className="font-mono text-xl font-bold text-navy-800">
                    {registeredMember.memberId}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-left"
                >
                  <p className="text-sm font-medium text-amber-800">
                    Want your membership card?
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    Pay the association dues to unlock your digital membership card and access all member benefits.
                  </p>
                </motion.div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/dues/pay" className="btn-primary gap-2">
                    <CreditCard className="h-4 w-4" /> Pay Association Dues
                  </Link>
                  <Link href="/" className="btn-secondary">
                    Go to Homepage
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageHero
        slug="membership"
        defaultHeading="Join RUNACOS"
        defaultSubheading="Become an official member of the Redeemer's University Association of Computer Science Students."
        breadcrumb="Home / Membership"
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
                      backgroundColor: i <= currentStep ? "#0B2C4D" : "#E5E7EB",
                      scale: i === currentStep ? 1.1 : 1,
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium"
                  >
                    <span className={i <= currentStep ? "text-white" : "text-gray-400"}>
                      {i < currentStep ? "\u2713" : i + 1}
                    </span>
                  </motion.div>
                  <span
                    className={`ml-2 hidden text-sm sm:inline ${
                      i <= currentStep ? "font-medium text-navy-800" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="mx-4 h-px w-8 sm:w-12">
                      <motion.div
                        animate={{
                          backgroundColor: i < currentStep ? "#0B2C4D" : "#E5E7EB",
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
                {/* Step 1: Personal Info */}
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Personal Information
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <User className="h-3.5 w-3.5" /> First Name *
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => updateForm("firstName", e.target.value)}
                          placeholder="Enter first name"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <User className="h-3.5 w-3.5" /> Last Name *
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => updateForm("lastName", e.target.value)}
                          placeholder="Enter last name"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Mail className="h-3.5 w-3.5" /> Email Address *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        onBlur={() => checkDuplicate("email", form.email)}
                        placeholder="your@email.com"
                        className={`input-field ${duplicateErrors.email ? "border-red-300 focus:ring-red-500" : ""}`}
                      />
                      {duplicateErrors.email && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle className="h-3 w-3" /> {duplicateErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Phone className="h-3.5 w-3.5" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        placeholder="+234 801 234 5678"
                        className="input-field"
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <User className="h-3.5 w-3.5" /> Gender *
                        </label>
                        <select
                          value={form.gender}
                          onChange={(e) => updateForm("gender", e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <MapPin className="h-3.5 w-3.5" /> State of Origin *
                        </label>
                        <select
                          value={form.stateOfOrigin}
                          onChange={(e) => updateForm("stateOfOrigin", e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select state</option>
                          {NIGERIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Details */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Academic Details
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <Hash className="h-3.5 w-3.5" /> Matric Number *
                        </label>
                        <input
                          type="text"
                          value={form.matricNumber}
                          onChange={(e) => updateForm("matricNumber", e.target.value)}
                          onBlur={() => checkDuplicate("matricNumber", form.matricNumber)}
                          placeholder="RUN/COS/21/0001"
                          className={`input-field ${duplicateErrors.matricNumber ? "border-red-300 focus:ring-red-500" : ""}`}
                        />
                        {duplicateErrors.matricNumber && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                            <AlertCircle className="h-3 w-3" /> {duplicateErrors.matricNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                          <GraduationCap className="h-3.5 w-3.5" /> Level *
                        </label>
                        <select
                          value={form.level}
                          onChange={(e) => updateForm("level", e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select level</option>
                          <option value="100">100 Level</option>
                          <option value="200">200 Level</option>
                          <option value="300">300 Level</option>
                          <option value="400">400 Level</option>
                          <option value="500">500 Level</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Calendar className="h-3.5 w-3.5" /> Admission Year *
                      </label>
                      <select
                        value={form.admissionYear}
                        onChange={(e) => updateForm("admissionYear", e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select year of admission (100L entry)</option>
                        {Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Building2 className="h-3.5 w-3.5" /> Faculty *
                      </label>
                      <select
                        value={form.faculty}
                        onChange={(e) => updateForm("faculty", e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select faculty</option>
                        {FACULTIES.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <GraduationCap className="h-3.5 w-3.5" /> Department *
                      </label>
                      <select
                        value={form.department}
                        onChange={(e) => updateForm("department", e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3: Passport Photo */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Passport Photograph
                    </h3>
                    <p className="text-sm text-gray-500">
                      Upload a clear passport photograph. This will be used for your
                      membership card.
                    </p>

                    {form.passportUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative h-48 w-40 overflow-hidden rounded-lg border-2 border-navy-200 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.passportUrl}
                            alt="Passport preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => updateForm("passportUrl", "")}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" /> Remove photo
                        </button>
                      </div>
                    ) : (
                      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-surface-3 p-10 text-center transition-colors hover:border-electric">
                        {uploading ? (
                          <Loader2 className="mx-auto h-12 w-12 text-blue-400 animate-spin" />
                        ) : (
                          <Camera className="mx-auto h-12 w-12 text-gray-300" />
                        )}
                        <p className="mt-3 text-sm font-medium text-gray-600">
                          {uploading ? "Uploading..." : "Click to upload passport photo"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          JPG or PNG, max 5MB. Use a clear, front-facing photo.
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/jpg"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("File size must be less than 5MB");
                              return;
                            }
                            setUploading(true);
                            try {
                              const formData = new FormData();
                              formData.append("file", file);
                              formData.append("folder", "passports");
                              const res = await fetch("/api/upload", {
                                method: "POST",
                                body: formData,
                              });
                              const data = await res.json();
                              if (res.ok && data.data?.url) {
                                updateForm("passportUrl", data.data.url);
                                toast.success("Passport photo uploaded");
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
                )}

                {/* Step 4: Review & Register */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      Review & Complete Registration
                    </h3>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                      {form.passportUrl && (
                        <div className="h-32 w-28 flex-shrink-0 overflow-hidden rounded-lg border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.passportUrl}
                            alt="Passport"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-3 rounded-xl bg-surface-1 p-4 w-full">
                        {[
                          { label: "Full Name", value: `${form.firstName} ${form.lastName}` },
                          { label: "Email", value: form.email },
                          { label: "Phone", value: form.phone },
                          { label: "Gender", value: form.gender },
                          { label: "State of Origin", value: form.stateOfOrigin },
                          { label: "Matric Number", value: form.matricNumber },
                          { label: "Level", value: `${form.level} Level` },
                          { label: "Admission Year", value: form.admissionYear || "N/A" },
                          { label: "Faculty", value: form.faculty },
                          { label: "Department", value: form.department },
                          ...(academicSession ? [{ label: "Session", value: `${academicSession} (${currentSemester || "N/A"} Semester)` }] : []),
                        ].map((item) => (
                          <div key={item.label}>
                            <p className="text-xs font-medium text-gray-400">{item.label}</p>
                            <p className="text-sm text-gray-700">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-medium text-emerald-800">
                        Registration is free
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        You can pay association dues later to get your membership card and access all member benefits.
                      </p>
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
                className={`btn-ghost gap-1 ${currentStep === 0 ? "invisible" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </motion.button>

              {currentStep < 3 ? (
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
                  onClick={handleRegister}
                  disabled={loading}
                  className="btn-primary gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {loading ? "Registering..." : "Complete Registration"}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
