export const SITE_NAME = "RUNACOS";
export const SITE_DESCRIPTION =
  "The Redeemer's University Association of Computer Science Students";
export const SITE_URL = process.env.NEXTAUTH_URL || "https://runacos.org";

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
  { label: "Executives", href: "/executives" },
  { label: "News & Events", href: "/news" },
  { label: "Resources", href: "/past-questions" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Executive Council", href: "/executives" },
  { label: "News & Events", href: "/news" },
  { label: "Academic Calendar", href: "/events" },
  { label: "Student Portal", href: "#" },
] as const;

export const FOOTER_RESOURCES = [
  { label: "Department Handbook", href: "#" },
  { label: "Past Questions", href: "/past-questions" },
  { label: "Project Database", href: "#" },
  { label: "e-Library Access", href: "#" },
  { label: "Course Materials", href: "#" },
] as const;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const ACCEPTED_DOC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB
