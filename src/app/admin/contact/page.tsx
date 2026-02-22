"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Eye,
  Trash2,
  X,
  Check,
  Search,
} from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type FilterStatus = "all" | "unread" | "read";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = async (status?: FilterStatus) => {
    try {
      let url = "/api/contact?limit=100";
      if (status === "read") url += "&isRead=true";
      else if (status === "unread") url += "&isRead=false";

      const res = await fetch(url);
      const json = await res.json();
      if (res.ok) {
        setMessages(json.data);
      } else {
        toast.error(json.error || "Failed to fetch messages");
      }
    } catch {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMessages(filter);
  }, [filter]);

  const handleExpand = async (message: ContactMessage) => {
    if (expandedId === message.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(message.id);

    // Mark as read if unread
    if (!message.isRead) {
      try {
        const res = await fetch(`/api/contact/${message.id}`, { method: "PUT" });
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
          );
        }
      } catch {
        // Silently fail - not critical
      }
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, message: ContactMessage) => {
    e.stopPropagation();
    if (message.isRead) return;

    try {
      const res = await fetch(`/api/contact/${message.id}`, { method: "PUT" });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
        );
        toast.success("Marked as read");
      } else {
        toast.error("Failed to mark as read");
      }
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (e: React.MouseEvent, message: ContactMessage) => {
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete the message from "${message.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/contact/${message.id}`, { method: "DELETE" });
      const json = await res.json();

      if (res.ok) {
        toast.success("Message deleted");
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
        if (expandedId === message.id) setExpandedId(null);
      } else {
        toast.error(json.error || "Failed to delete message");
      }
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-surface-0 rounded-xl border border-surface-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-surface-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-64 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
          {unreadCount > 0 && ` (${unreadCount} unread)`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface-0 rounded-xl border border-surface-3 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 mr-2">Filter:</span>
          {(
            [
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ] as { value: FilterStatus; label: string }[]
          ).map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                filter === option.value
                  ? "bg-navy-800 text-white"
                  : "text-gray-600 hover:bg-surface-1"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-surface-0 rounded-xl border border-surface-3 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === "unread"
                ? "No unread messages"
                : filter === "read"
                ? "No read messages"
                : "No contact messages yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-3">
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Message Row */}
                <div
                  onClick={() => handleExpand(message)}
                  className={cn(
                    "flex items-start gap-4 p-4 cursor-pointer transition-colors",
                    !message.isRead ? "bg-blue-50/40" : "hover:bg-surface-1/50",
                    expandedId === message.id && "bg-surface-1"
                  )}
                >
                  {/* Unread indicator */}
                  <div className="flex-shrink-0 mt-1">
                    {!message.isRead ? (
                      <div className="w-2.5 h-2.5 bg-electric rounded-full" />
                    ) : (
                      <div className="w-2.5 h-2.5" />
                    )}
                  </div>

                  {/* Message content preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={cn(
                          "text-sm truncate",
                          !message.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                        )}
                      >
                        {message.name}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        &middot; {formatDateShort(message.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 truncate">{message.email}</span>
                    </div>
                    <p
                      className={cn(
                        "text-sm truncate",
                        !message.isRead ? "font-medium text-gray-800" : "text-gray-600"
                      )}
                    >
                      {message.subject}
                    </p>
                    {/* Read status badge */}
                    <span
                      className={cn(
                        "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md font-mono text-xs font-medium",
                        message.isRead
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      )}
                    >
                      {message.isRead ? "Read" : "Unread"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!message.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(e, message)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, message)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Message Content */}
                <AnimatePresence>
                  {expandedId === message.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pl-11">
                        <div className="bg-surface-1 rounded-lg p-4 border border-surface-3">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {message.subject}
                            </h3>
                            <button
                              onClick={() => setExpandedId(null)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-500 mb-3 flex items-center gap-4">
                            <span>From: {message.name}</span>
                            <span>&lt;{message.email}&gt;</span>
                          </div>
                          <div className="border-t border-surface-3 pt-3">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
