import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
) {
  if (!process.env.BREVO_SMTP_LOGIN || !process.env.BREVO_SMTP_KEY) {
    console.log("Brevo SMTP not configured, skipping email send");
    return;
  }

  if (recipients.length === 0) return;

  // Send in batches of 50
  const batchSize = 50;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    try {
      await transporter.sendMail({
        from: `"RUNACOS" <${process.env.BREVO_SMTP_LOGIN}>`,
        bcc: batch,
        subject,
        html,
      });
    } catch (error) {
      console.error("Failed to send batch email:", error);
    }
  }
}

export async function getMailingRecipients(): Promise<string[]> {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["mail_to_subscribers", "mail_to_members", "mail_to_alumni"] } },
  });
  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  const recipients = new Set<string>();

  // Newsletter subscribers
  if (settingsMap.mail_to_subscribers === "true") {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { email: true },
    });
    subscribers.forEach((s) => recipients.add(s.email));
  }

  // Non-alumni members
  if (settingsMap.mail_to_members === "true") {
    const members = await prisma.member.findMany({
      where: { isAlumni: false },
      select: { email: true },
    });
    members.forEach((m) => recipients.add(m.email));
  }

  // Alumni
  if (settingsMap.mail_to_alumni === "true") {
    const alumni = await prisma.member.findMany({
      where: { isAlumni: true },
      select: { email: true },
    });
    alumni.forEach((a) => recipients.add(a.email));
  }

  return Array.from(recipients);
}

export function buildContentEmail(
  type: "news" | "event" | "article",
  title: string,
  excerpt: string,
  slug: string
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://runacos.org";
  const typeLabel = type === "news" ? "News" : type === "event" ? "Event" : "Article";
  const typePath = type === "news" ? "news" : type === "event" ? "events" : "articles";
  const url = `${baseUrl}/${typePath}/${slug}`;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0B2C4D; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">RUNACOS</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.7;">New ${typeLabel} Published</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #111827;">${title}</h2>
        <p style="margin: 0 0 20px; font-size: 14px; color: #6b7280; line-height: 1.6;">${excerpt}</p>
        <a href="${url}" style="display: inline-block; background: #3B82F6; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">Read More</a>
      </div>
      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">
        Redeemer's University Association of Computer Science Students
      </p>
    </div>
  `;
}
