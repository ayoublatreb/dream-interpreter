import './globals.css'
import Navbar from '../components/Navbar'
import BackgroundCanvas from '../components/BackgroundCanvas'
import Footer from '../components/Footer'


export const metadata = {
  metadataBase: new URL('https://www.ahlamok.com'),
  title: {
    default: 'تفسير الأحلام بالذكاء الاصطناعي | Ahlamok',
    template: '%s | موقع أحلامك'
  },
  description: 'استكشف معاني أحلامك بدقة وسرعة باستخدام الذكاء الاصطناعي.',
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: 'https://www.ahlamok.com',
    siteName: 'Ahlamok',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ahlamok',
    creator: '@ahlamok',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E94CG0SYNP"
        />
        <script
          id="google-analytics"
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8092442602967189"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        <BackgroundCanvas />
        {children}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          direction: 'ltr',
          margin: '0 auto'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '900px',
            padding: '20px 18px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}