import { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | تفسير الأحلام',
  description: 'سياسة الخصوصية لموقع تفسير الأحلام - كيفية جمع واستخدام وحماية بياناتك الشخصية',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <Header />
      <main className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center">سياسة الخصوصية</h1>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p><strong>آخر تحديث: يناير 2024</strong></p>
              
              <h2 className="text-2xl font-bold text-indigo-900">1. مقدمة</h2>
              <p>
                نحن ملتزمون بحماية خصوصيتك وحماية بياناتك الشخصية. سياسة الخصوصية هذه توضح كيفية جمعنا واستخدامنا وحماية معلوماتك الشخصية عند زيارتك لموقعنا الإلكتروني.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">2. المعلومات التي نجمعها</h2>
              <p>
                نجمع المعلومات التي تقدمها إلينا بشكل إرادي، مثل الاسم والبريد الإلكتروني عند التواصل معنا. كما نجمع بيانات تقنية تلقائية مثل عنوان IP الخاص بك ونوع المتصفح المستخدم.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">3. استخدام المعلومات</h2>
              <p>
                نستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسين تجربتك على الموقع. قد نستخدم بريدك الإلكتروني للتواصل معك أو إرسال تحديثات عن الموقع.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">4. حماية البيانات</h2>
              <p>
                نستخدم تقنيات أمان متقدمة لحماية بياناتك الشخصية من السرقة والفقدان والاستخدام غير المصرح به.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">5. ملفات تعريف الارتباط</h2>
              <p>
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع وتحليل حركة الزوار. يمكنك إدارة ملفات تعريف الارتباط من إعدادات متصفحك.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">6. روابط خارجية</h2>
              <p>
                قد يحتوي الموقع على روابط لمواقع خارجية لا نتحكم في محتواها أو ممارسات الخصوصية الخاصة بها.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">7. حقوقك</h2>
              <p>
                لديك الحق في الوصول إلى بياناتك الشخصية وتعديلها أو حذفها. يمكنك التواصل معنا في أي وقت لتفعيل هذه الحقوق.
              </p>
              
              <h2 className="text-2xl font-bold text-indigo-900">8. التواصل معنا</h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يمكنك التواصل معنا عبر صفحة التواصل معنا.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
