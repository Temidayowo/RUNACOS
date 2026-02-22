import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-custom py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="section-label mb-3">Legal</p>
        <h1 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated: January 1, 2025</p>

        <div className="prose-custom mt-10">
          <h2>1. Information We Collect</h2>
          <p>RUNACOS collects personal information you voluntarily provide when using our services, including your name, email address, phone number, and academic details when you submit forms, register for events, or report faults.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information collected to process fault reports, manage event registrations, respond to contact inquiries, send newsletters (with consent), and improve our services.</p>

          <h2>3. Data Storage and Security</h2>
          <p>Your data is stored securely using industry-standard encryption. We use trusted third-party services (Vercel, TiDB Cloud) for data storage and processing. We do not sell your personal information to third parties.</p>

          <h2>4. Cookies</h2>
          <p>Our website uses essential cookies for authentication and session management. No tracking or advertising cookies are used.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data. Contact us at info@runacos.org to exercise these rights.</p>

          <h2>6. Contact</h2>
          <p>For privacy-related inquiries, contact us at info@runacos.org.</p>
        </div>
      </div>
    </div>
  );
}
