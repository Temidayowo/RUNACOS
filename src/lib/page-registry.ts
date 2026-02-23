export interface PageEntry {
  slug: string;
  route: string;
  label: string;
  defaultHeading: string;
  defaultSubheading: string;
  breadcrumb: string;
}

export const PAGE_REGISTRY: PageEntry[] = [
  {
    slug: "about",
    route: "/about",
    label: "About",
    defaultHeading: "About {highlight}RUNACOS{/highlight}",
    defaultSubheading: "Our mission, vision, and the story behind the association.",
    breadcrumb: "Home / About",
  },
  {
    slug: "articles",
    route: "/articles",
    label: "Articles",
    defaultHeading: "Articles & Insights",
    defaultSubheading: "Read tutorials, research insights, and opinions from RUNACOS members and faculty.",
    breadcrumb: "Home / Articles",
  },
  {
    slug: "contact",
    route: "/contact",
    label: "Contact",
    defaultHeading: "Get in Touch",
    defaultSubheading: "We'd love to hear from you. Drop us a message.",
    breadcrumb: "Home / Contact",
  },
  {
    slug: "events",
    route: "/events",
    label: "Events",
    defaultHeading: "Events & Activities",
    defaultSubheading: "Discover workshops, seminars, hackathons, and social activities organized by RUNACOS.",
    breadcrumb: "Home / Events",
  },
  {
    slug: "news",
    route: "/news",
    label: "News",
    defaultHeading: "News & Updates",
    defaultSubheading: "Stay informed with the latest from the Department and RUNACOS.",
    breadcrumb: "Home / News",
  },
  {
    slug: "executives",
    route: "/executives",
    label: "Executives",
    defaultHeading: "Meet Our Executive Council",
    defaultSubheading: "The student leaders driving RUNACOS forward.",
    breadcrumb: "Home / Executives",
  },
  {
    slug: "past-questions",
    route: "/past-questions",
    label: "Past Questions",
    defaultHeading: "Past Questions Repository",
    defaultSubheading: "Access previous exam questions to prepare better.",
    breadcrumb: "Home / Past Questions",
  },
  {
    slug: "staff",
    route: "/staff",
    label: "Staff",
    defaultHeading: "Department Staff",
    defaultSubheading: "The brilliant minds shaping the next generation of computer scientists.",
    breadcrumb: "Home / Staff",
  },
  {
    slug: "privacy-policy",
    route: "/privacy-policy",
    label: "Privacy Policy",
    defaultHeading: "Privacy Policy",
    defaultSubheading: "How we collect, use, and protect your personal information.",
    breadcrumb: "Home / Privacy Policy",
  },
  {
    slug: "terms-of-service",
    route: "/terms-of-service",
    label: "Terms of Service",
    defaultHeading: "Terms of Service",
    defaultSubheading: "The rules and guidelines for using the RUNACOS website and services.",
    breadcrumb: "Home / Terms of Service",
  },
  {
    slug: "constitution",
    route: "/constitution",
    label: "Constitution",
    defaultHeading: "RUNACOS Constitution",
    defaultSubheading: "The guiding principles and rules that govern the Redeemer's University Association of Computer Science Students.",
    breadcrumb: "Home / Constitution",
  },
  {
    slug: "membership",
    route: "/membership",
    label: "Membership",
    defaultHeading: "Join RUNACOS",
    defaultSubheading: "Become an official member of the Redeemer's University Association of Computer Science Students.",
    breadcrumb: "Home / Membership",
  },
  {
    slug: "frms-report",
    route: "/frms/report",
    label: "Report a Fault",
    defaultHeading: "Report a Fault",
    defaultSubheading: "Submit maintenance and facility issues for quick resolution by our team.",
    breadcrumb: "Home / FRMS / Report",
  },
  {
    slug: "frms-track",
    route: "/frms/track",
    label: "Track Your Report",
    defaultHeading: "Track Your Report",
    defaultSubheading: "Enter your reference ID to check the current status of your fault report.",
    breadcrumb: "Home / FRMS / Track",
  },
];
