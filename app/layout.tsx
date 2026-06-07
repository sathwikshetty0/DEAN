import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Billing Software",
  description: "Billing and Invoicing Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-slate-50">
        <Providers>
          <Sidebar />
          <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
