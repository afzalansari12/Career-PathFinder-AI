// frontend/src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathFinder - AI Career Accelerator",
  description: "AI-driven ATS optimization, interview preparation, and job matching.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="overflow-x-hidden">
        <body className="overflow-x-hidden w-full max-w-full bg-background text-foreground font-sans antialiased">
          {children}
          {/* Razorpay Checkout SDK */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}