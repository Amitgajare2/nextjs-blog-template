import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "../components/ClientThemeProvider";
import PageTransition from "../components/PageTransition";
import { getAuthorData } from "../utils/author";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const author = getAuthorData();

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: author.name,
    template: `%s | ${author.name}`,
  },
  description: author.shortBio,
  keywords: ['blog', 'technology', 'programming', 'software', 'guides', ...author.expertise],
  authors: [{ name: author.name, url: author.website }],
  creator: author.name,
  publisher: author.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: author.name,
    title: author.name,
    description: author.shortBio,
    images: [
      {
        url: author.avatar || '/og.png',
        width: 1200,
        height: 630,
        alt: author.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: author.name,
    description: author.shortBio,
    images: [author.avatar || '/og.png'],
    creator: author.social.twitter ? `@${author.social.twitter.split('/').pop()}` : undefined,
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
};

export const viewport: Viewport = {
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
  const author = getAuthorData();
  
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.shortBio,
    url: author.website,
    image: author.avatar,
    jobTitle: author.credentials.title,
    worksFor: author.credentials.company,
    knowsAbout: author.expertise,
    sameAs: Object.values(author.social).filter(url => url),
    email: author.email,
    address: author.location ? {
      '@type': 'PostalAddress',
      addressLocality: author.location
    } : undefined
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
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

