import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "RUNACOS - Association of Computer Science Students",
    template: "%s | RUNACOS",
  },
  description:
    "The Redeemer's University Association of Computer Science Students (RUNACOS) - Empowering the Future of Technology & Innovation",
  keywords: [
    "RUNACOS",
    "Computer Science",
    "Redeemer's University",
    "Student Association",
    "Technology",
  ],
  openGraph: {
    title: "RUNACOS - Association of Computer Science Students",
    description:
      "The official body representing the brilliant minds of the Department of Computer Science at Redeemer's University",
    url: "https://runacos.org",
    siteName: "RUNACOS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-surface-1 font-sans">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
