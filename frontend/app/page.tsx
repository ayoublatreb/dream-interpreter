import { Metadata } from 'next';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import DreamRecorderSection from './components/DreamRecorderSection';
import IntroductionSection from './components/IntroductionSection';
import FeaturedArticles from './components/FeaturedArticles';
import LatestArticles from './components/LatestArticles';
import CategoriesSection from './components/CategoriesSection';
import { articles, categories } from './data/articles';

export const metadata: Metadata = {
  title: 'تفسير الأحلام | أكبر موقع متخصص في تفسير الرؤى والأحلام',
  description: 'موقع تفسير الأحلام العربي - أكبر موقع متخصص في تفسير الأحلام والرؤى بالتفصيل مع تفسيرات ابن سيرين ونابلسي وابن شاهين. اكتشف دلالات أحلامك الآن.',
  keywords: ['تفسير الأحلام', 'تفسير الرؤى', 'أحلام', 'ابن سيرين', 'نابلسي', 'ابن شاهين', 'تعبير الرؤيا'],
  openGraph: {
    title: 'تفسير الأحلام | أكبر موقع متخصص في تفسير الرؤى والأحلام',
    description: 'موقع تفسير الأحلام العربي - أكبر موقع متخصص في تفسير الأحلام والرؤى بالتفصيل',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header currentPage="home" />
      <main>
        <HeroSection />
        <DreamRecorderSection />
        <IntroductionSection />
        <FeaturedArticles articles={articles} />
        <LatestArticles articles={articles} />
        <CategoriesSection categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
