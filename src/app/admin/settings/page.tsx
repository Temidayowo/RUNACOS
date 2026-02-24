"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Settings, Users, Mail, CreditCard, Loader2, Save, Calendar, Image, Upload, X, Tag, Share2, Twitter, Instagram, Linkedin } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [fee, setFee] = useState("");
  const [duesAmount, setDuesAmount] = useState("");
  const [paystackPrefix, setPaystackPrefix] = useState("");
  const [savingFee, setSavingFee] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Academic session state
  const [academicSession, setAcademicSession] = useState("");
  const [currentSemester, setCurrentSemester] = useState("");
  const [savingSession, setSavingSession] = useState(false);

  // Badge template state
  const [badgeTemplateUrl, setBadgeTemplateUrl] = useState("");
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [savingBadge, setSavingBadge] = useState(false);

  // Mailing preferences state
  const [mailToSubscribers, setMailToSubscribers] = useState(true);
  const [mailToMembers, setMailToMembers] = useState(true);
  const [mailToAlumni, setMailToAlumni] = useState(false);
  const [savingMailing, setSavingMailing] = useState(false);

  // Social media links state
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [savingSocial, setSavingSocial] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.membership_fee) {
          setFee(data.data.membership_fee);
        }
        if (data.data?.dues_amount) {
          setDuesAmount(data.data.dues_amount);
        }
        if (data.data?.paystack_prefix) {
          setPaystackPrefix(data.data.paystack_prefix);
        }
        if (data.data?.academic_session) {
          setAcademicSession(data.data.academic_session);
        }
        if (data.data?.current_semester) {
          setCurrentSemester(data.data.current_semester);
        }
        if (data.data?.badge_template) {
          setBadgeTemplateUrl(data.data.badge_template);
        }
        if (data.data?.mail_to_subscribers !== undefined) {
          setMailToSubscribers(data.data.mail_to_subscribers === "true");
        }
        if (data.data?.mail_to_members !== undefined) {
          setMailToMembers(data.data.mail_to_members === "true");
        }
        if (data.data?.mail_to_alumni !== undefined) {
          setMailToAlumni(data.data.mail_to_alumni === "true");
        }
        if (data.data?.social_twitter) {
          setTwitterUrl(data.data.social_twitter);
        }
        if (data.data?.social_instagram) {
          setInstagramUrl(data.data.social_instagram);
        }
        if (data.data?.social_linkedin) {
          setLinkedinUrl(data.data.social_linkedin);
        }
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoadingSettings(false));
  }, []);

  const saveFees = async () => {
    if (!fee || isNaN(Number(fee))) {
      toast.error("Please enter a valid membership card fee");
      return;
    }
    if (!duesAmount || isNaN(Number(duesAmount))) {
      toast.error("Please enter a valid dues amount");
      return;
    }
    setSavingFee(true);
    try {
      const settings = [
        { key: "membership_fee", value: fee },
        { key: "dues_amount", value: duesAmount },
        { key: "paystack_prefix", value: paystackPrefix || "RUNACOS" },
      ];
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Fees & payment settings updated");
      } else {
        toast.error(data.error || "Failed to update fees");
      }
    } catch {
      toast.error("Failed to update fees");
    } finally {
      setSavingFee(false);
    }
  };

  const saveAcademicSession = async () => {
    if (!academicSession) {
      toast.error("Please enter an academic session");
      return;
    }
    setSavingSession(true);
    try {
      const settings = [
        { key: "academic_session", value: academicSession },
        { key: "current_semester", value: currentSemester },
      ];
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Academic session updated successfully");
      } else {
        toast.error(data.error || "Failed to update academic session");
      }
    } catch {
      toast.error("Failed to update academic session");
    } finally {
      setSavingSession(false);
    }
  };

  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setUploadingBadge(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "badges");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        setBadgeTemplateUrl(data.data.url);
        // Save to settings
        setSavingBadge(true);
        const saveRes = await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: [{ key: "badge_template", value: data.data.url }],
          }),
        });
        if (saveRes.ok) {
          toast.success("Badge template uploaded and saved");
        } else {
          toast.error("Badge uploaded but failed to save setting");
        }
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingBadge(false);
      setSavingBadge(false);
    }
  };

  const removeBadgeTemplate = async () => {
    setSavingBadge(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [{ key: "badge_template", value: "" }],
        }),
      });
      if (res.ok) {
        setBadgeTemplateUrl("");
        toast.success("Badge template removed");
      } else {
        toast.error("Failed to remove badge template");
      }
    } catch {
      toast.error("Failed to remove badge template");
    } finally {
      setSavingBadge(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="bg-surface-0 rounded-xl border border-surface-3 p-6 space-y-4">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage fees, academic session, and site configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Site Information
                </h2>
                <p className="text-xs text-gray-500">General information about the site</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Site Name
              </label>
              <p className="text-sm font-medium text-gray-900">RUNACOS</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <p className="text-sm text-gray-700">
                Redeemer&apos;s University Association of Computer Science Students (RUNACOS).
                A platform for news, events, articles, past questions, membership, and fault reporting.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Platform
              </label>
              <p className="text-sm text-gray-700">Next.js Web Application</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Version
              </label>
              <p className="text-sm text-gray-700">2.0.0</p>
            </div>
          </div>
        </motion.div>

        {/* Current User Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Your Account
                </h2>
                <p className="text-xs text-gray-500">Currently logged-in user details</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {session?.user ? (
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {session.user.name ? getInitials(session.user.name) : "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{session.user.name}</p>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-xs font-medium mt-1",
                        (session.user as any).role === "ADMIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {(session.user as any).role || "STAFF"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="border-t border-surface-3 pt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-700">
                        {session.user.email || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Role
                    </label>
                    <p className="text-sm text-gray-700">
                      {(session.user as any).role === "ADMIN" ? "Administrator" : "Staff Member"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Users className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Unable to load user information</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Fees & Payments */}
      {(session?.user as any)?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Fees & Payments
                </h2>
                <p className="text-xs text-gray-500">
                  Configure membership card fee, per-session dues amount, and payment prefix
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {loadingSettings ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      Membership Card Fee (Naira)
                    </label>
                    <p className="text-[11px] text-gray-400 mb-1.5">One-time fee to get membership card</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        &#8358;
                      </span>
                      <input
                        type="number"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        placeholder="5000"
                        className="input-field pl-8"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      Session Dues Amount (Naira)
                    </label>
                    <p className="text-[11px] text-gray-400 mb-1.5">Per-session association dues</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        &#8358;
                      </span>
                      <input
                        type="number"
                        value={duesAmount}
                        onChange={(e) => setDuesAmount(e.target.value)}
                        placeholder="5000"
                        className="input-field pl-8"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="max-w-xs">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Payment Reference Prefix
                  </label>
                  <p className="text-[11px] text-gray-400 mb-1.5">Prefix for Paystack payment references (e.g. RUNACOS-20252026-XXXX)</p>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                    <input
                      type="text"
                      value={paystackPrefix}
                      onChange={(e) => setPaystackPrefix(e.target.value.toUpperCase())}
                      placeholder="RUNACOS"
                      className="input-field pl-9"
                    />
                  </div>
                </div>
                <button
                  onClick={saveFees}
                  disabled={savingFee}
                  className="btn-primary gap-2 text-sm"
                >
                  {savingFee ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {savingFee ? "Saving..." : "Save Fees & Payment Settings"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Academic Session Settings */}
      {(session?.user as any)?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Academic Session
                </h2>
                <p className="text-xs text-gray-500">
                  Set the current academic session and semester
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  placeholder="2025/2026"
                  className="input-field"
                />
              </div>
              <div className="flex-1 max-w-xs">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Current Semester
                </label>
                <select
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select semester</option>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                </select>
              </div>
              <button
                onClick={saveAcademicSession}
                disabled={savingSession}
                className="btn-primary gap-2 text-sm h-[42px]"
              >
                {savingSession ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {savingSession ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Badge Template Settings */}
      {(session?.user as any)?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Badge Template
                </h2>
                <p className="text-xs text-gray-500">
                  Upload a custom background image for the membership badge
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {badgeTemplateUrl ? (
              <div className="space-y-4">
                <div className="relative inline-block rounded-lg overflow-hidden border border-surface-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badgeTemplateUrl}
                    alt="Badge template preview"
                    className="max-w-xs h-auto"
                  />
                </div>
                <div className="flex gap-3">
                  <label className="btn-secondary gap-2 text-sm cursor-pointer">
                    {uploadingBadge ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingBadge ? "Uploading..." : "Replace"}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg"
                      disabled={uploadingBadge}
                      onChange={handleBadgeUpload}
                    />
                  </label>
                  <button
                    onClick={removeBadgeTemplate}
                    disabled={savingBadge}
                    className="btn-ghost gap-2 text-sm text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer rounded-xl border-2 border-dashed border-surface-3 p-8 text-center transition-colors hover:border-blue-300 max-w-sm">
                {uploadingBadge ? (
                  <Loader2 className="mx-auto h-10 w-10 text-blue-400 animate-spin" />
                ) : (
                  <Upload className="mx-auto h-10 w-10 text-gray-300" />
                )}
                <p className="mt-2 text-sm font-medium text-gray-600">
                  {uploadingBadge ? "Uploading..." : "Click to upload badge template"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  JPG or PNG, max 5MB. Recommended size: 600x380px
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg"
                  disabled={uploadingBadge}
                  onChange={handleBadgeUpload}
                />
              </label>
            )}
          </div>
        </motion.div>
      )}

      {/* Mailing Preferences */}
      {(session?.user as any)?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Mailing Preferences
                </h2>
                <p className="text-xs text-gray-500">
                  Control who receives email notifications when new content is published
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Newsletter Subscribers", value: mailToSubscribers, setter: setMailToSubscribers, key: "mail_to_subscribers" },
              { label: "Active Members", value: mailToMembers, setter: setMailToMembers, key: "mail_to_members" },
              { label: "Alumni", value: mailToAlumni, setter: setMailToAlumni, key: "mail_to_alumni" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <button
                  onClick={() => item.setter(!item.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    item.value ? "bg-electric" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
            <button
              onClick={async () => {
                setSavingMailing(true);
                try {
                  const res = await fetch("/api/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      settings: [
                        { key: "mail_to_subscribers", value: String(mailToSubscribers) },
                        { key: "mail_to_members", value: String(mailToMembers) },
                        { key: "mail_to_alumni", value: String(mailToAlumni) },
                      ],
                    }),
                  });
                  if (res.ok) toast.success("Mailing preferences saved");
                  else toast.error("Failed to save");
                } catch { toast.error("Failed to save"); }
                finally { setSavingMailing(false); }
              }}
              disabled={savingMailing}
              className="btn-primary gap-2 text-sm"
            >
              {savingMailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {savingMailing ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Social Media Links */}
      {(session?.user as any)?.role === "ADMIN" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-0 rounded-xl border border-surface-3"
        >
          <div className="px-6 py-4 border-b border-surface-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  Social Media Links
                </h2>
                <p className="text-xs text-gray-500">
                  Set your association&apos;s social media profile URLs displayed in the footer
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Twitter / X", icon: Twitter, value: twitterUrl, setter: setTwitterUrl, placeholder: "https://twitter.com/runacos" },
              { label: "Instagram", icon: Instagram, value: instagramUrl, setter: setInstagramUrl, placeholder: "https://instagram.com/runacos" },
              { label: "LinkedIn", icon: Linkedin, value: linkedinUrl, setter: setLinkedinUrl, placeholder: "https://linkedin.com/company/runacos" },
            ].map((item) => (
              <div key={item.label}>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  {item.label}
                </label>
                <div className="relative">
                  <item.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="url"
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    placeholder={item.placeholder}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={async () => {
                setSavingSocial(true);
                try {
                  const res = await fetch("/api/settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      settings: [
                        { key: "social_twitter", value: twitterUrl },
                        { key: "social_instagram", value: instagramUrl },
                        { key: "social_linkedin", value: linkedinUrl },
                      ],
                    }),
                  });
                  if (res.ok) toast.success("Social media links saved");
                  else toast.error("Failed to save");
                } catch { toast.error("Failed to save"); }
                finally { setSavingSocial(false); }
              }}
              disabled={savingSocial}
              className="btn-primary gap-2 text-sm"
            >
              {savingSocial ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {savingSocial ? "Saving..." : "Save Social Links"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-blue-50 border border-blue-100 rounded-lg p-4"
      >
        <p className="text-sm text-blue-700">
          Contact the system administrator to update site configuration or modify account permissions.
        </p>
      </motion.div>
    </div>
  );
}
