import { redirect } from 'next/navigation';

export default function SharePage({ searchParams }) {
  const d = searchParams?.d || '';
  const i = searchParams?.i || '';
  
  // Redirect to the main page with the parameters
  if (d || i) {
    const params = new URLSearchParams();
    if (d) params.set('d', d);
    if (i) params.set('i', i);
    
    redirect(`/?${params.toString()}`);
  } else {
    redirect('/');
  }
}

export async function generateMetadata({ searchParams }) {
  const d = searchParams?.d || '';
  const i = searchParams?.i || '';
  
  // Decode the parameters
  const dreamText = d ? decodeURIComponent(d) : 'تفسير الأحلام';
  const interpretationText = i ? decodeURIComponent(i) : 'احصل على تفسير دقيق لحلمك الآن.';
  
  return {
    title: `تفسير حلم: ${dreamText.substring(0, 50)}...`,
    description: `📖 التفسير: ${interpretationText.substring(0, 250)}...`,
    openGraph: {
      title: `💭 حلم: ${dreamText.substring(0, 60)}...`,
      description: `📖 التفسير: ${interpretationText.substring(0, 250)}...`,
      type: 'article',
      locale: 'ar_AR',
      siteName: 'Ahlamok - تفسير الأحلام',
      url: `https://www.ahlamok.com/share?d=${d}&i=${i}`,
      images: [
        {
          url: 'https://www.ahlamok.com/dream-icon.png',
          width: 1200,
          height: 630,
          alt: 'تفسير الأحلام'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `💭 حلم: ${dreamText.substring(0, 60)}...`,
      description: `📖 التفسير: ${interpretationText.substring(0, 250)}...`,
      images: ['https://www.ahlamok.com/dream-icon.png']
    }
  };
}
