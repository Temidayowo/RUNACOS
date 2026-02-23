import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed superadmin user
  const adminEmail = process.env.ADMIN_EMAIL || "superadmin@runacos.org";
  const adminPassword = process.env.ADMIN_PASSWORD || "SuperAdmin@2026";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Superadmin created:", admin.email);

  // Seed a staff user
  const staffPassword = await bcrypt.hash("Staff@2026", 12);
  const staff = await prisma.user.upsert({
    where: { email: "staff@runacos.org" },
    update: {},
    create: {
      name: "John Adeyemi",
      email: "staff@runacos.org",
      password: staffPassword,
      role: "STAFF",
    },
  });

  console.log("✅ Staff user created:", staff.email);

  // Seed fault categories
  const categories = [
    { name: "Electrical", description: "Electrical faults including power outages, faulty outlets, and wiring issues" },
    { name: "Plumbing", description: "Water supply, drainage, and plumbing fixture issues" },
    { name: "IT/Network", description: "Internet connectivity, network equipment, and IT infrastructure" },
    { name: "Furniture", description: "Damaged desks, chairs, and other furniture" },
    { name: "Building/Structure", description: "Structural issues, ceiling, walls, doors, and windows" },
    { name: "Air Conditioning", description: "HVAC and cooling system issues" },
    { name: "Cleaning/Sanitation", description: "Cleanliness and sanitation concerns" },
    { name: "Security", description: "Locks, CCTV, and security-related issues" },
    { name: "Other", description: "Other maintenance issues not covered above" },
  ];

  const categoryRecords: Record<string, string> = {};
  for (const cat of categories) {
    const record = await prisma.faultCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    categoryRecords[cat.name] = record.id;
  }

  console.log("✅ Fault categories seeded:", categories.length);

  // Seed demo news
  const newsItems = [
    {
      title: "Computer Science Department Accreditation Success",
      slug: "cs-department-accreditation-success",
      content: "We are pleased to announce that the NUC accreditation team has fully accredited our Computer Science program for another five years. This milestone reflects the department's commitment to academic excellence, modern curriculum design, and world-class facilities.\n\nThe accreditation review highlighted our strong faculty-to-student ratio, well-equipped laboratories, and robust research output. Students and staff are congratulated for their contributions to this achievement.\n\nKey highlights from the review include:\n- Modern curriculum aligned with industry standards\n- Excellent laboratory facilities\n- Strong research publications\n- Active student associations and clubs\n- Industry partnerships and internship programs",
      excerpt: "We are pleased to announce that the NUC accreditation team has fully accredited our Computer Science program for another five years.",
      category: "Academics",
      author: "Prof. Adebayo",
      status: "PUBLISHED",
      publishedAt: new Date("2025-10-15"),
    },
    {
      title: "Annual RUNACOS Hackathon: Innovating for Nigeria",
      slug: "annual-runacos-hackathon",
      content: "Join us for a 48-hour coding marathon where students develop solutions for real-life challenges. From healthcare innovations to agricultural technology, this year's hackathon promises to push boundaries.\n\nTeams of 3-5 members will compete across categories including:\n- Health Tech\n- AgriTech\n- FinTech\n- EdTech\n\nPrizes include internship opportunities, cash awards, and mentorship from industry leaders. Registration is now open!",
      excerpt: "Join us for a 48-hour coding marathon where students develop solutions for real-life challenges.",
      category: "Events",
      author: "RUNACOS Team",
      status: "PUBLISHED",
      publishedAt: new Date("2025-10-20"),
    },
    {
      title: "Meet the New RUNACOS Executive Council 2025/2026",
      slug: "new-executive-council-2025-2026",
      content: "The elections have concluded with a new set of leaders for the association. The new executive council, led by our President Olumide Akinwale, promises to deliver an exciting year.\n\nThe full executive team:\n- President: Olumide Akinwale\n- Vice President: Adaeze Okonkwo\n- General Secretary: Bolu Oladipo\n- Financial Secretary: Chioma Nwankwo\n- Public Relations Officer: Yusuf Ibrahim\n\nWe wish them a successful tenure!",
      excerpt: "The elections have concluded with a new set of leaders for the association.",
      category: "Student Life",
      author: "Electoral Committee",
      status: "PUBLISHED",
      publishedAt: new Date("2025-09-28"),
    },
    {
      title: "Important: First Semester Examination Schedule Released",
      slug: "first-semester-exam-schedule",
      content: "The examination schedule for the 2025/2026 first semester is now available on the notice board and student portal. Please review the dates carefully and prepare accordingly.\n\nExaminations will begin on December 15, 2025, and end on January 20, 2026. All students are expected to check their examination timetables on the student portal.",
      excerpt: "The examination schedule for the 2025/2026 first semester is now available on the notice board.",
      category: "Academics",
      author: "Academic Office",
      status: "PUBLISHED",
      publishedAt: new Date("2025-09-15"),
    },
    {
      title: "Faculty Spotlight: Dr. Adebayo's AI Research Breakthrough",
      slug: "dr-adebayo-ai-research",
      content: "Our very own Dr. O. Adebayo recently published a groundbreaking paper on AI applications in African agriculture. Read about her incredible journey and the impact of her research on food security across the continent.\n\nThe paper, published in the International Journal of AI Applications, proposes a novel machine learning approach for predicting crop yields in tropical climates.",
      excerpt: "Our very own Dr. O. Adebayo recently published a groundbreaking paper on AI applications in African agriculture.",
      category: "Academics",
      author: "Research Office",
      status: "PUBLISHED",
      publishedAt: new Date("2025-08-25"),
    },
    {
      title: "Tech Career Fair 2025: Bridging the Gap",
      slug: "tech-career-fair-2025",
      content: "Top tech companies and startups are coming to campus. Prepare your CVs and portfolios for a chance to connect with industry leaders. This is your opportunity to explore internship and full-time roles.\n\nParticipating companies include Google, Microsoft, Flutterwave, Paystack, Andela, and many more.",
      excerpt: "Top tech companies and startups are coming to campus. Prepare your CVs and portfolios.",
      category: "Events",
      author: "Career Services",
      status: "PUBLISHED",
      publishedAt: new Date("2025-09-01"),
    },
  ];

  for (const item of newsItems) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  console.log("✅ Demo news seeded:", newsItems.length);

  // Seed demo events
  const events = [
    {
      title: "RUNACOS Annual Hackathon 2026",
      slug: "runacos-hackathon-2026",
      description: "A 48-hour coding marathon where students develop innovative solutions. Teams of 3-5 members will compete across categories including Health Tech, AgriTech, FinTech, and EdTech. Prizes include internship opportunities and cash awards.",
      location: "CS Main Hall, Block A",
      eventDate: new Date("2026-03-15T09:00:00"),
      endDate: new Date("2026-03-17T17:00:00"),
      status: "PUBLISHED",
    },
    {
      title: "Workshop: Introduction to Machine Learning",
      slug: "intro-to-ml-workshop",
      description: "A hands-on workshop covering the fundamentals of Machine Learning using Python and scikit-learn. Suitable for beginners with basic programming knowledge. Bring your laptop!",
      location: "CS Lab 2, Block B",
      eventDate: new Date("2026-03-08T10:00:00"),
      endDate: new Date("2026-03-08T15:00:00"),
      status: "PUBLISHED",
    },
    {
      title: "Tech Career Fair 2026",
      slug: "tech-career-fair-2026",
      description: "Connect with top tech companies and startups. Bring your CVs and portfolios. Companies include Google, Microsoft, Flutterwave, Paystack, and Andela.",
      location: "University Auditorium",
      eventDate: new Date("2026-04-10T09:00:00"),
      endDate: new Date("2026-04-10T17:00:00"),
      status: "PUBLISHED",
    },
    {
      title: "Cybersecurity Awareness Seminar",
      slug: "cybersecurity-seminar",
      description: "Learn about the latest cybersecurity threats and how to protect yourself online. Guest speakers from the Nigerian Computer Emergency Response Team (ngCERT).",
      location: "Lecture Theatre 1",
      eventDate: new Date("2026-03-25T14:00:00"),
      status: "PUBLISHED",
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log("✅ Demo events seeded:", events.length);

  // Seed demo articles
  const articles = [
    {
      title: "Getting Started with Next.js: A Comprehensive Guide",
      slug: "getting-started-nextjs",
      content: "Next.js is a powerful React framework that enables server-side rendering, static site generation, and much more. In this comprehensive guide, we'll walk through setting up your first Next.js project and explore its key features.\n\n## Why Next.js?\n\nNext.js offers several advantages over plain React:\n- Server-side rendering for better SEO\n- Automatic code splitting\n- Built-in routing\n- API routes\n- Image optimization\n\n## Getting Started\n\nTo create a new Next.js project, run:\n```\nnpx create-next-app@latest my-app\n```\n\nThis will scaffold a new project with all the necessary configurations.",
      excerpt: "Next.js is a powerful React framework. In this guide, we explore setting up your first project and its key features.",
      category: "Technology",
      author: "Adaeze Okonkwo",
      status: "PUBLISHED",
      publishedAt: new Date("2025-10-10"),
    },
    {
      title: "The Future of AI in Nigerian Education",
      slug: "ai-in-nigerian-education",
      content: "Artificial Intelligence is transforming education globally, and Nigeria is no exception. From personalized learning to automated grading, AI holds immense potential for our educational system.\n\nThis article explores current AI implementations in Nigerian universities and the roadmap for future adoption.",
      excerpt: "AI is transforming education globally. Explore current implementations in Nigerian universities and the future roadmap.",
      category: "Research",
      author: "Dr. Yusuf Ibrahim",
      status: "PUBLISHED",
      publishedAt: new Date("2025-09-20"),
    },
    {
      title: "Data Structures Every CS Student Should Know",
      slug: "essential-data-structures",
      content: "Understanding data structures is fundamental to computer science. This article covers the essential data structures every CS student should master, from arrays and linked lists to trees and graphs.\n\nWe'll cover:\n1. Arrays and Dynamic Arrays\n2. Linked Lists\n3. Stacks and Queues\n4. Hash Tables\n5. Binary Trees and BSTs\n6. Graphs\n7. Heaps",
      excerpt: "Understanding data structures is fundamental. Here are the essential ones every CS student should master.",
      category: "Academic",
      author: "Bolu Oladipo",
      status: "PUBLISHED",
      publishedAt: new Date("2025-08-15"),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log("✅ Demo articles seeded:", articles.length);

  // Seed demo fault reports
  const faults = [
    {
      referenceId: "FRMS-2026-ABC123",
      name: "Tunde Olamide",
      email: "tunde@student.run.edu.ng",
      phone: "+234 801 234 5678",
      location: "CS Lab 1, Block A, Room 102",
      categoryId: categoryRecords["Electrical"],
      description: "Multiple power outlets in CS Lab 1 are not functioning. This affects about 10 workstations on the left side of the room. The issue has been ongoing for 3 days.",
      status: "OPEN",
    },
    {
      referenceId: "FRMS-2026-DEF456",
      name: "Amina Bello",
      email: "amina@student.run.edu.ng",
      location: "Block B, Corridor, 2nd Floor",
      categoryId: categoryRecords["Plumbing"],
      description: "Water leak from the ceiling near the staircase on the 2nd floor. The leak creates a puddle on the floor which is a safety hazard.",
      status: "IN_PROGRESS",
      assignedStaffId: staff.id,
    },
    {
      referenceId: "FRMS-2026-GHI789",
      name: "Chidi Eze",
      email: "chidi@student.run.edu.ng",
      phone: "+234 802 345 6789",
      location: "CS Lab 2, Block B",
      categoryId: categoryRecords["IT/Network"],
      description: "WiFi connectivity is extremely slow in CS Lab 2. Students cannot access online resources for coursework. Speed tests show less than 1 Mbps.",
      status: "RESOLVED",
      assignedStaffId: staff.id,
    },
    {
      referenceId: "FRMS-2026-JKL012",
      name: "Fatima Yusuf",
      email: "fatima@student.run.edu.ng",
      location: "Lecture Theatre 1",
      categoryId: categoryRecords["Air Conditioning"],
      description: "The air conditioning unit in Lecture Theatre 1 is making loud rattling noises and barely cooling. The room becomes uncomfortable during afternoon lectures.",
      status: "OPEN",
    },
  ];

  for (const fault of faults) {
    const existing = await prisma.fault.findUnique({ where: { referenceId: fault.referenceId } });
    if (!existing) {
      const created = await prisma.fault.create({
        data: fault,
      });
      // Add initial status history
      await prisma.faultStatusHistory.create({
        data: {
          faultId: created.id,
          status: "OPEN",
          note: "Fault report submitted",
        },
      });
      // Add status history for IN_PROGRESS and RESOLVED faults
      if (fault.status === "IN_PROGRESS" || fault.status === "RESOLVED") {
        await prisma.faultStatusHistory.create({
          data: {
            faultId: created.id,
            status: "IN_PROGRESS",
            note: "Assigned to maintenance staff",
            changedBy: admin.id,
          },
        });
      }
      if (fault.status === "RESOLVED") {
        await prisma.faultStatusHistory.create({
          data: {
            faultId: created.id,
            status: "RESOLVED",
            note: "Issue has been fixed. WiFi router replaced.",
            changedBy: staff.id,
          },
        });
      }
    }
  }

  console.log("✅ Demo fault reports seeded:", faults.length);

  // Seed executives
  const executivesList = [
    { name: "Olumide Akinwale", position: "President", email: "president@runacos.org", order: 0 },
    { name: "Adaeze Okonkwo", position: "Vice President", email: "vp@runacos.org", order: 1 },
    { name: "Bolu Oladipo", position: "General Secretary", email: "gensec@runacos.org", order: 2 },
    { name: "Chioma Nwankwo", position: "Financial Secretary", email: null, order: 3 },
    { name: "Yusuf Ibrahim", position: "Public Relations Officer", email: null, order: 4 },
    { name: "Grace Nwosu", position: "Director of Socials", email: null, order: 5 },
    { name: "Tunde Akinwale", position: "Director of Sports", email: null, order: 6 },
    { name: "Amina Bello", position: "Welfare Director", email: null, order: 7 },
  ];

  for (const exec of executivesList) {
    const existing = await prisma.executive.findFirst({ where: { position: exec.position } });
    if (!existing) {
      await prisma.executive.create({
        data: {
          name: exec.name,
          position: exec.position,
          email: exec.email,
          order: exec.order,
          active: true,
        },
      });
    }
  }

  console.log("✅ Executives seeded:", executivesList.length);

  // Seed demo contact submissions
  const contacts = [
    {
      name: "Oluwaseun Bakare",
      email: "seun@gmail.com",
      subject: "Partnership Inquiry",
      message: "Hello RUNACOS team, I represent TechCorp Nigeria and we'd like to explore partnership opportunities with your association. Can we schedule a meeting?",
      isRead: false,
    },
    {
      name: "Grace Obi",
      email: "grace.obi@yahoo.com",
      subject: "Membership Question",
      message: "I'm a 200-level student and I'd like to know how to join RUNACOS. What are the requirements and fees involved?",
      isRead: true,
    },
  ];

  const existingContacts = await prisma.contactSubmission.count();
  if (existingContacts === 0) {
    for (const contact of contacts) {
      await prisma.contactSubmission.create({ data: contact });
    }
    console.log("✅ Demo contacts seeded:", contacts.length);
  } else {
    console.log("⏭️ Contacts already exist, skipping (" + existingContacts + " found)");
  }

  // Seed site settings
  await prisma.siteSetting.upsert({
    where: { key: "membership_fee" },
    update: {},
    create: { key: "membership_fee", value: "5000" },
  });

  // Seed default page hero background images
  const pageHeroes: Record<string, { heading: string; subheading: string; backgroundImage: string }> = {
    about: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80",
    },
    contact: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80",
    },
    events: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
    },
    news: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&q=80",
    },
    articles: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&q=80",
    },
    executives: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80",
    },
    staff: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80",
    },
    "past-questions": {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80",
    },
    constitution: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
    },
    "privacy-policy": {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1920&q=80",
    },
    "terms-of-service": {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80",
    },
    membership: {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80",
    },
    "frms-report": {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80",
    },
    "frms-track": {
      heading: "",
      subheading: "",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80",
    },
  };

  await prisma.siteSetting.upsert({
    where: { key: "page_heroes" },
    update: {},
    create: { key: "page_heroes", value: JSON.stringify(pageHeroes) },
  });

  console.log("✅ Page hero images seeded:", Object.keys(pageHeroes).length, "pages");

  console.log("✅ Site settings seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Superadmin Login:");
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
