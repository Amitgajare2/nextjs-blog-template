import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "../components/ClientThemeProvider";
import PageTransition from "../components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'unfilteredmind',
    template: '%s | unfilteredmind',
  },
  description: 'For those who read between the lies.',
  keywords: ['blog', 'technology', 'programming', 'software', 'guides'],
  authors: [{ name: 'unfilteredmind' }],
  creator: 'unfilteredmind',
  publisher: 'unfilteredmind',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'unfilteredmind',
    title: 'unfilteredmind',
    description: 'For those who read between the lies.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'unfilteredmind',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'unfilteredmind',
    description: 'For those who read between the lies.',
    images: ['/og.png'],
    creator: '@your_handle',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0d' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientThemeProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ClientThemeProvider>
      </body>
    </html>
  );
}

