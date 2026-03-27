import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }

  if (recipients.length === 0) return;

  // Send in batches of 50
  const batchSize = 50;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    try {
      await transporter.sendMail({
        from: `"RUNACOS" <${process.env.GMAIL_USER}>`,
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

export async function sendRegistrationEmail({
  to,
  name,
  eventTitle,
  eventDate,
  eventLocation,
  registrationId,
}: {
  to: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  registrationId: string;
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(registrationId)}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0B2C4D; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">RUNACOS</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.7;">Event Registration Confirmed</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #111827;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #6b7280;">You're registered for:</p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 6px; font-size: 16px; font-weight: 600; color: #111827;">${eventTitle}</p>
          <p style="margin: 0 0 4px; font-size: 13px; color: #6b7280;">📅 ${eventDate}</p>
          <p style="margin: 0; font-size: 13px; color: #6b7280;">📍 ${eventLocation}</p>
        </div>
        <p style="font-size: 14px; color: #6b7280;">Present this QR code at the event entrance for check-in:</p>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${qrDataUrl}" alt="Check-in QR Code" width="200" height="200" style="border-radius: 8px; border: 1px solid #e5e7eb;" />
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">Registration ID: ${registrationId}</p>
      </div>
      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">
        Redeemer's University Association of Computer Science Students
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RUNACOS" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your registration for ${eventTitle} – QR Check-in`,
    html,
  });
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
  const unsubscribeUrl = `${baseUrl}/newsletter/unsubscribe`;

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
      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 4px;">
        No longer want these emails? <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
      </p>
    </div>
  `;
}

export async function sendMemberWelcomeEmail({
  to,
  firstName,
  lastName,
  memberId,
  matricNumber,
  level,
  department,
  faculty,
  passportUrl,
}: {
  to: string;
  firstName: string;
  lastName: string;
  memberId: string;
  matricNumber: string;
  level: string;
  department?: string | null;
  faculty?: string | null;
  passportUrl: string;
}) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return;
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://runacos.org";
  const cardUrl = `${baseUrl}/membership/card/${memberId}`;
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const issuedDate = `${months[now.getMonth()]} ${now.getFullYear()}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0B2C4D; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">RUNACOS</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.7;">Membership Registration Confirmed</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #111827;">Hi <strong>${firstName} ${lastName}</strong>,</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          Welcome to RUNACOS! Your membership has been registered. Here is your membership card:
        </p>

        <!-- Membership Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-radius: 14px; overflow: hidden; background: linear-gradient(135deg, #0B2C4D 0%, #0f3d6e 60%, #1a5276 100%); color: white;">
          <tr>
            <td style="padding: 20px 20px 12px;">
              <!-- Card Header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 16px; font-weight: 700; color: white; letter-spacing: 0.05em;">RUNACOS</p>
                    <p style="margin: 2px 0 0; font-size: 10px; color: rgba(255,255,255,0.55); font-family: monospace; text-transform: uppercase; letter-spacing: 0.08em;">Membership Card</p>
                  </td>
                  <td align="right" valign="top">
                    <img src="${passportUrl}" alt="Passport" width="56" height="70"
                      style="border-radius: 8px; border: 2px solid rgba(255,255,255,0.2); object-fit: cover; display: block;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 20px 8px;">
              <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Name</p>
              <p style="margin: 0; font-size: 15px; font-weight: 600; color: white;">${firstName} ${lastName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 20px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Matric No</p>
                    <p style="margin: 0; font-size: 13px; font-family: monospace; color: white;">${matricNumber}</p>
                  </td>
                  <td width="50%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Level</p>
                    <p style="margin: 0; font-size: 13px; font-family: monospace; color: white;">${level}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${department || faculty ? `
          <tr>
            <td style="padding: 0 20px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${department ? `<td width="50%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Department</p>
                    <p style="margin: 0; font-size: 12px; color: white;">${department}</p>
                  </td>` : ""}
                  ${faculty ? `<td width="50%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Faculty</p>
                    <p style="margin: 0; font-size: 12px; color: white;">${faculty}</p>
                  </td>` : ""}
                </tr>
              </table>
            </td>
          </tr>` : ""}
          <tr>
            <td style="padding: 0 20px 8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="40%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Member ID</p>
                    <p style="margin: 0; font-size: 13px; font-family: monospace; font-weight: 700; color: #60a5fa;">${memberId}</p>
                  </td>
                  <td width="30%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Validity</p>
                    <p style="margin: 0; font-size: 12px; color: white;">Lifetime</p>
                  </td>
                  <td width="30%">
                    <p style="margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; font-family: monospace;">Issued</p>
                    <p style="margin: 0; font-size: 12px; font-family: monospace; color: white;">${issuedDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 20px 14px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 8px;">
              <p style="margin: 0; font-size: 10px; color: rgba(255,255,255,0.4); font-family: monospace;">Association of Computer Science Students · Redeemer's University, Ede</p>
            </td>
          </tr>
        </table>

        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          You can view and download your full membership card from the link below:
        </p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${cardUrl}" style="display: inline-block; background: #0B2C4D; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; margin-right: 10px;">View & Download Card</a>
        </div>
      </div>
      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">
        Redeemer's University Association of Computer Science Students
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RUNACOS" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Welcome to RUNACOS – Your Membership Card`,
    html,
  });
}
