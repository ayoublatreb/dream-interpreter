import MainDreamInterpreter from '../components/MainDreamInterpreter';

export const metadata = {
  title: 'تفسير الأحلام بالذكاء الاصطناعي | فسّر حلمك الآن',
  description:
    'فسّر حلمك الآن بالذكاء الاصطناعي وفق منهج ابن سيرين والنابلسي. تفسير أحلام دقيق، فوري ومجاني.',
  openGraph: {
    title: 'تفسير الأحلام بالذكاء الاصطناعي',
    description:
      'احصل على تفسير دقيق لحلمك باستخدام الذكاء الاصطناعي ومنهج كبار المفسرين.',
    type: 'website',
    locale: 'ar_AR',
    siteName: 'Ahlamok',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تفسير الأحلام بالذكاء الاصطناعي',
    description: 'فسّر حلمك الآن بدقة وسرعة.',
  },
};

export default function Home() {
  // WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ahlamok - تفسير الأحلام',
    url: 'https://www.ahlamok.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.ahlamok.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'هل تفسير الأحلام بالذكاء الاصطناعي دقيق؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'يعتمد التفسير على تحليل ذكي للحلم بالاستناد إلى مصادر معروفة مثل ابن سيرين والنابلسي.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل تفسير الأحلام مجاني؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، يمكنك تفسير حلمك مجانًا عبر موقع أحلامك.',
        },
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* AI Interpreter */}
      <MainDreamInterpreter />
    </>
  );
}
