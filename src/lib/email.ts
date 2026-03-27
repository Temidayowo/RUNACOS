import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function isConfigured() {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendFaultConfirmation(data: {
  referenceId: string;
  email: string;
  name: string;
  location: string;
  category: string;
}) {
  if (!isConfigured()) {
    return;
  }

  const trackUrl = `${process.env.NEXTAUTH_URL || "https://runacos.org"}/frms/track/${data.referenceId}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0B2C4D; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">RUNACOS</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.7;">Fault Report Received</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #111827;">Hi <strong>${data.name}</strong>,</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          Your fault report has been received and logged successfully. Use the tracking code below to monitor the status of your report.
        </p>
        <div style="background: #f0f9ff; border: 2px dashed #3B82F6; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center;">
          <p style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Your Tracking Code</p>
          <p style="margin: 0; font-size: 24px; font-weight: 700; font-family: monospace; color: #1d4ed8; letter-spacing: 0.1em;">${data.referenceId}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; font-weight: 600; color: #374151; width: 120px; border-radius: 4px 0 0 0;">Location</td>
            <td style="padding: 10px 12px; background: #f9fafb; color: #6b7280; border-radius: 0 4px 0 0;">${data.location}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; font-weight: 600; color: #374151;">Category</td>
            <td style="padding: 10px 12px; color: #6b7280;">${data.category}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; background: #f9fafb; font-weight: 600; color: #374151; border-radius: 0 0 0 4px;">Status</td>
            <td style="padding: 10px 12px; background: #f9fafb; border-radius: 0 0 4px 0;">
              <span style="display: inline-block; padding: 2px 10px; background: #dcfce7; color: #15803d; border-radius: 9999px; font-size: 12px; font-weight: 600;">OPEN</span>
            </td>
          </tr>
        </table>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${trackUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">Track Your Report</a>
        </div>
      </div>
      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">
        Redeemer's University Association of Computer Science Students
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RUNACOS FRMS" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `Fault Report Received – Tracking Code: ${data.referenceId}`,
    html,
  });
}

export async function sendFaultNotification(data: {
  referenceId: string;
  email: string;
  name: string;
  status: string;
}) {
  if (!isConfigured()) {
    return;
  }

  const trackUrl = `${process.env.NEXTAUTH_URL || "https://runacos.org"}/frms/track/${data.referenceId}`;

  const statusColors: Record<string, { bg: string; text: string }> = {
    OPEN: { bg: "#dcfce7", text: "#15803d" },
    IN_PROGRESS: { bg: "#fef9c3", text: "#a16207" },
    RESOLVED: { bg: "#dbeafe", text: "#1d4ed8" },
    CLOSED: { bg: "#f3f4f6", text: "#6b7280" },
  };
  const color = statusColors[data.status] ?? { bg: "#f3f4f6", text: "#374151" };

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0B2C4D; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">RUNACOS</h1>
        <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.7;">Fault Report Update</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #111827;">Hi <strong>${data.name}</strong>,</p>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
          Your fault report <strong style="font-family: monospace; color: #1d4ed8;">${data.referenceId}</strong> has been updated.
        </p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
          <p style="margin: 0 0 6px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">New Status</p>
          <span style="display: inline-block; padding: 4px 16px; background: ${color.bg}; color: ${color.text}; border-radius: 9999px; font-size: 14px; font-weight: 700;">${data.status.replace("_", " ")}</span>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${trackUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">View Report</a>
        </div>
      </div>
      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">
        Redeemer's University Association of Computer Science Students
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RUNACOS FRMS" <${process.env.GMAIL_USER}>`,
    to: data.email,
    subject: `Fault Report Update – ${data.referenceId} is now ${data.status.replace("_", " ")}`,
    html,
  });
}
