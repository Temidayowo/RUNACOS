export async function sendFaultNotification(data: {
  referenceId: string;
  email: string;
  name: string;
  status: string;
}) {
  // Only send if RESEND_API_KEY is configured
  if (!process.env.RESEND_API_KEY) {
    console.log("Email skipped: RESEND_API_KEY not configured");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

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
