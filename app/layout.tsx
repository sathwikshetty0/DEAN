import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { AlertProvider } from "@/context/AlertContext";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { PWARegistration } from "@/components/shared/PWARegistration";

export const dynamic = "force-dynamic";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "D-EAN | Decentralized Emergency Assistance Network",
  description:
    "Whether the internet works or not — your SOS always gets through. Community-driven emergency coordination platform for Mangaluru.",
  manifest: "/manifest.json",
  themeColor: "#FF2D55",
};

import { InstallPrompt } from "@/components/shared/InstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${dmSans.variable} font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased`}
      >
        <NetworkProvider>
          <PWARegistration />
          <InstallPrompt />
          <AuthProvider>
            <AlertProvider>
              <OfflineBanner />
              {children}
            </AlertProvider>
          </AuthProvider>
        </NetworkProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1C2333",
              color: "#F8FAFC",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "500",
            },
          }}
        />
      </body>
    </html>
  );
}
