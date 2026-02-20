import { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | تفسير الأحلام',
  description: 'شروط الاستخدام لموقع تفسير الأحلام - الأحكام والشروط المتعلقة باستخدام الموقع',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <Header />
      <main className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center">شروط الاستخدام</h1>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p><strong>آخر تحديث: يناير 2024</strong></p>
              
              <h2 className="text-2xl font-bold text-indigo-900">1. قبول الشروط</h2>
              <p>
                باستخدام موقعنا الإلكتروني، فإنك توافق على الامتثال لهذه الشروط والأحكام وسياسة الخصوصية الخاصة بنا.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">2. المحتوى</h2>
              <p>
                المحتوى المتاح على الموقع مقدم لأغراض تعليمية وثقافية فقط. نحاول تقديم معلومات دقيقة وموثوقة، لكننا لا نقدم نصائح مهنية أو طبية.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">3. حقوق الملكية</h2>
              <p>
                جميع الحقوق محفوظة لموقع تفسير الأحلام. المحتوى والشعار والتصميم الخاص بالموقع محمي بحقوق الملكية الفكرية.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">4. الاستخدام الشخصي</h2>
              <p>
                يُسمح باستخدام الموقع لأغراض شخصية فقط. يُمنع استخدام الموقع لأغراض تجارية أو غير قانونية.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">5. التعديلات</h2>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت دون سابق إنذار. يُنصح بمراجعة الشروط بشكل دوري.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">6. التحذيرات</h2>
              <p>
                نتحمل مسؤولية عن المحتوى المنشور على الموقع. نحاول تقديم معلومات دقيقة وموثوقة، لكننا لا نتحمل مسؤولية أي خسائر أو أضرار ناتجة عن استخدام المعلومات الموجودة على الموقع.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
