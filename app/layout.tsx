import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WebSocketProvider } from "@/components/websocket-provider";
import { Toaster } from "sonner";
import { NotificationsListener } from "@/components/notifications-listener";
import { SessionProvider } from "@/components/session-provider";
import { auth } from "@/auth";
import { getPlatformSettings } from "@/app/actions/settings";
import { MaintenanceWrapper } from "@/components/maintenance-wrapper";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const settings = await getPlatformSettings()
  
  // @ts-ignore
  const role = session?.user?.role
  const isSuperAdmin = session?.user?.email === "b.subburoyal@gmail.com"
  const isAdmin = role === "ADMIN" || isSuperAdmin
  
  // Hardcoding userId for demo purposes. In a real app this comes from auth context.
  const currentUserId = 1;

  if (settings.maintenanceMode && !isAdmin) {
    return (
      <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MaintenanceWrapper>
                {children}
              </MaintenanceWrapper>
              <Toaster position="top-right" />
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    )
  }

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
