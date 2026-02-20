'use client';

import Link from 'next/link';
import { categories } from '../data/articles';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌙</span>
              <span className="text-xl font-bold">تفسير الأحلام</span>
            </div>
            <p className="text-gray-400">
              أكبر موقع متخصص في تفسير الأحلام والرؤى بالتفصيل
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors cursor-pointer">الرئيسية</Link></li>
              <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors cursor-pointer">المقالات</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors cursor-pointer">التصنيفات</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer">من نحن</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">التصنيفات</h3>
            <ul className="space-y-2">
              {categories.slice(0, 4).map(cat => (
                <li key={cat.id}><Link href={`/categories?cat=${cat.name}`} className="text-gray-400 hover:text-white transition-colors cursor-pointer">{cat.icon} {cat.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">القانوني</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors cursor-pointer">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors cursor-pointer">شروط الاستخدام</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer">تواصل معنا</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2024 تفسير الأحلام. جميع الحقوق محفوظة.</p>
          <p className="mt-2 text-sm">
            المحتوى مقدم لأغراض تعليمية وثقافية فقط. نحاول تقديم معلومات دقيقة وموثوقة، لكننا لا نقدم نصائح مهنية أو طبية.
          </p>
        </div>
      </div>
    </footer>
  );
}
