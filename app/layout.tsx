import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WebSocketProvider } from "@/components/websocket-provider";
import { Toaster } from "sonner";
import { NotificationsListener } from "@/components/notifications-listener";

import { SessionProvider } from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nova Lance",
  description: "Next-gen freelance platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hardcoding userId for demo purposes. In a real app this comes from auth context.
  const currentUserId = 1;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <WebSocketProvider userId={currentUserId}>
              {children}
              <Toaster position="top-right" />
              <NotificationsListener />
            </WebSocketProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
