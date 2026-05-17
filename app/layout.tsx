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
  description: "Whether the internet works or not — your SOS always gets through. Community-driven emergency coordination platform for Mangaluru.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "D-EAN",
  },
  openGraph: {
    type: "website",
    siteName: "D-EAN Mangaluru",
    title: "D-EAN | Decentralized Emergency Assistance Network",
    description: "Mangaluru's resilient community emergency network. SOS broadcasts even during internet outages.",
  },
  twitter: {
    card: "summary_large_image",
    title: "D-EAN | Resilient SOS Network",
    description: "Decentralized emergency coordination for Mangaluru.",
  },
};


import { InstallPrompt } from "@/components/shared/InstallPrompt";
import { OfflineSync } from "@/components/shared/OfflineSync";
import { QuickActions } from "@/components/shared/QuickActions";
import { SkipToContent } from "@/components/shared/SkipToContent";
import { CommandPalette } from "@/components/shared/CommandPalette";

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
          <SkipToContent />
          <CommandPalette />
          <PWARegistration />
          <InstallPrompt />
          <OfflineSync />
          <QuickActions />
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
