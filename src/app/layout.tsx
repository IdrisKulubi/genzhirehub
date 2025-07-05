import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { constructMetadata } from "@/lib/metadata";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Analytics />
            {children}
            <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        expand={false}
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            color: '#1e293b',
          },
        }}
      />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
