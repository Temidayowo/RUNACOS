async function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.log("Email skipped: RESEND_API_KEY not configured");
    return null;
  }
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendFaultConfirmation(data: {
  referenceId: string;
  email: string;
  name: string;
  location: string;
  category: string;
}) {
  const resend = await getResend();
  if (!resend) return;

  try {
    const trackUrl = `${process.env.NEXTAUTH_URL}/frms/track/${data.referenceId}`;

    await resend.emails.send({
      from: "RUNACOS FRMS <noreply@runacos.org>",
      to: data.email,
      subject: `Fault Report Received - ${data.referenceId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e;">Fault Report Submitted</h2>
          <p>Dear ${data.name},</p>
          <p>Your fault report has been received and logged successfully.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold; width: 140px;">Tracking Code</td>
              <td style="padding: 8px 12px; background: #f5f5f5; font-family: monospace; font-size: 16px; color: #3b82f6;">${data.referenceId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Location</td>
              <td style="padding: 8px 12px;">${data.location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f5f5f5; font-weight: bold;">Category</td>
              <td style="padding: 8px 12px; background: #f5f5f5;">${data.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold;">Status</td>
              <td style="padding: 8px 12px;">OPEN</td>
            </tr>
          </table>
          <p>Use the tracking code above to check the status of your report at any time:</p>
          <p><a href="${trackUrl}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px;">Track Your Report</a></p>
          <br/>
          <p style="color: #666;">— RUNACOS Fault Reporting & Management System</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send fault confirmation email:", error);
  }
}

export async function sendFaultNotification(data: {
  referenceId: string;
  email: string;
  name: string;
  status: string;
}) {
  const resend = await getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: "RUNACOS FRMS <noreply@runacos.org>",
      to: data.email,
      subject: `Fault Report Update - ${data.referenceId}`,
      html: `
        <h2>Fault Report Status Update</h2>
        <p>Dear ${data.name},</p>
        <p>Your fault report <strong>${data.referenceId}</strong> has been updated.</p>
        <p>New Status: <strong>${data.status}</strong></p>
        <p>You can track your report at: ${process.env.NEXTAUTH_URL}/frms/track/${data.referenceId}</p>
        <br/>
        <p>— RUNACOS Fault Reporting & Management System</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
