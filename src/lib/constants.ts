export const SITE_NAME = "RUNACOS";
export const SITE_DESCRIPTION =
  "The Redeemer's University Association of Computer Science Students";
export const SITE_URL = process.env.NEXTAUTH_URL || "https://runacos.org";
export const SITE_VERSION = "2.0.0";

export const FAULT_STATUSES = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "yellow" },
  RESOLVED: { label: "Resolved", color: "green" },
  CLOSED: { label: "Closed", color: "gray" },
} as const;

export const CONTENT_STATUSES = {
  DRAFT: { label: "Draft", color: "gray" },
  PUBLISHED: { label: "Published", color: "green" },
  ARCHIVED: { label: "Archived", color: "yellow" },
} as const;

export const NEWS_CATEGORIES = [
  "All News",
  "Academics",
  "Events",
  "Student Life",
] as const;

export const PQ_DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
] as const;

export const ITEMS_PER_PAGE = 9;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Articles", href: "/articles" },
  { label: "Past Questions", href: "/past-questions" },
  { label: "Executives", href: "/executives" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_RESOURCES = [
  { label: "Past Questions", href: "/past-questions" },
  { label: "Articles", href: "/articles" },
  { label: "Constitution", href: "/constitution" },
  { label: "FRMS", href: "/frms/report" },
] as const;

export const FOOTER_CONNECT = [
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Email Us", href: "mailto:info@runacos.org" },
] as const;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const ACCEPTED_JSON_TYPES = ["application/json"];
export const ACCEPTED_DOC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
