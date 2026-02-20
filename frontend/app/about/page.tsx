import { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'من نحن | تفسير الأحلام',
  description: 'تعرف على موقع تفسير الأحلام وأهدافنا في تقديم تفسيرات الأحلام والرؤى بدقة وموثوقية',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <Header currentPage="about" />
      <main className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center">من نحن؟</h1>
          </div>
          
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">🌙 عن موقع تفسير الأحلام</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                نحن فريق من الباحثين والمهتمين بعلم تفسير الأحلام، نهدف إلى تقديم محتوى عالي الجودة ومفيد لكل من يبحث عن تفسير رؤاه وأحلامه.
              </p>
              <p>
                نشأ موقعنا من رغبة في توضيح دلالات الأحلام من خلال أقوال العلماء الكبار مثل الإمام ابن سيرين والشيخ عبد الغني النابلسي وابن شاهين، مع إضافة التفسيرات النفسية المعاصرة.
              </p>
              <h2 className="text-2xl font-bold text-indigo-900 mt-8 mb-4">📖 مهمتنا</h2>
              <p>
                مهمتنا هي تقديم محتوى دقيق ومفصل لكل حلم يمكن أن يخطر ببالكم، مع مراعاة الجودة والصدق في المعلومات. نسعى إلى أن يكون موقعنا مرجعاً موثوقاً لكل من يبحث عن تفسير الأحلام.
              </p>
              <h2 className="text-2xl font-bold text-indigo-900 mt-8 mb-4">🎯 قيمنا</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>الصدق في المعلومات والتوثيق</li>
                <li>الاحترام للقارئ والمحتوى</li>
                <li>الجودة في كل مقال ننشره</li>
                <li>الاستمرارية في النمو والتطوير</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
