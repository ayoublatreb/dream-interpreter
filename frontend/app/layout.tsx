import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ahlamok.com'),
  title: 'تفسير الأحلام | أكبر موقع متخصص في تفسير الرؤى والأحلام',
  description: 'موقع تفسير الأحلام العربي - أكبر موقع متخصص في تفسير الأحلام والرؤى بالتفصيل مع تفسيرات ابن سيرين ونابلسي وابن شاهين',
  keywords: ['تفسير الأحلام', 'تفسير الرؤى', 'أحلام', 'ابن سيرين', 'تفسير الأحلام للعزباء', 'تفسير الأحلام للحامل', 'نابلسي', 'ابن شاهين'],
  authors: [{ name: 'تفسير الأحلام' }],
  creator: 'تفسير الأحلام',
  publisher: 'تفسير الأحلام',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: 'https://ahlamok.com',
    siteName: 'تفسير الأحلام',
    title: 'تفسير الأحلام | أكبر موقع متخصص في تفسير الرؤى والأحلام',
    description: 'موقع تفسير الأحلام العربي - أكبر موقع متخصص في تفسير الأحلام والرؤى بالتفصيل مع تفسيرات ابن سيرين ونابلسي وابن شاهين',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'تفسير الأحلام',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تفسير الأحلام | أكبر موقع متخصص في تفسير الرؤى والأحلام',
    description: 'موقع تفسير الأحلام العربي - أكبر موقع متخصص في تفسير الأحلام والرؤى بالتفصيل',
  },
  alternates: {
    canonical: 'https://ahlamok.com',
    languages: {
      'ar': 'https://ahlamok.com',
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  other: {
    'adsense-client': 'ca-pub-XXXXXXXXXX', // Replace with your AdSense client ID
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="تفسير الأحلام" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E94CG0SYNP"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E94CG0SYNP');
            `,
          }}
        />
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8092442602967189"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
