import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero
        slug="terms-of-service"
        defaultHeading="Terms of Service"
        defaultSubheading="The rules and guidelines for using the RUNACOS website and services."
        breadcrumb="Home / Terms of Service"
      />

      <div className="container-custom py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono mt-2 text-sm text-gray-400">Last updated: January 1, 2025</p>

          <div className="prose-custom mt-10">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using the RUNACOS website, you agree to comply with these terms of service. If you do not agree, please do not use our services.</p>

            <h2>2. Use of Services</h2>
            <p>Our services are intended for students, staff, and faculty of Redeemer&apos;s University. You agree to use our services responsibly and in accordance with university policies.</p>

            <h2>3. User Accounts</h2>
            <p>Administrative accounts are provided to authorized RUNACOS executives and staff only. You are responsible for maintaining the confidentiality of your account credentials.</p>

            <h2>4. Content</h2>
            <p>All content published on this website is the property of RUNACOS or its respective authors. Reproduction without permission is prohibited.</p>

            <h2>5. Fault Reporting</h2>
            <p>When submitting fault reports, you agree to provide accurate information. False or misleading reports may result in restricted access to the reporting system.</p>

            <h2>6. Limitation of Liability</h2>
            <p>RUNACOS is not liable for any damages arising from the use of this website or its services. We make no warranties regarding the accuracy or availability of our services.</p>

            <h2>7. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of updated terms.</p>
          </div>
        </div>
      </div>
    </>
  );
}
