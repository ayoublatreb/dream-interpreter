'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { articles } from '../../data/articles';
import { Article, ArticleContent } from '../../data/articles';

export default function ArticlePage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const article = articles.find((a: Article) => a.id === id);
  const [activeSection, setActiveSection] = useState('introduction');
  
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header />
        <main className="py-20 text-center">
          <h1 className="text-2xl font-bold">المقال غير موجود</h1>
          <Link href="/articles" className="text-indigo-600 hover:underline mt-4 block">
            العودة للمقالات
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  const sections = [
    { id: 'introduction', label: 'المقدمة' },
    { id: 'generalMeaning', label: 'المعنى العام' },
    { id: 'ibnSirin', label: 'ابن سيرين' },
    { id: 'nabulsi', label: 'النابلسي' },
    { id: 'ibnShaheen', label: 'ابن شاهين' },
    { id: 'singleWoman', label: 'العزباء' },
    { id: 'married', label: 'المتزوجة' },
    { id: 'pregnant', label: 'الحامل' },
    { id: 'divorced', label: 'المطلقة' },
    { id: 'man', label: 'الرجل' },
    { id: 'psychological', label: 'التفسير النفسي' },
    { id: 'advice', label: 'نصائح' },
    { id: 'conclusion', label: 'الخاتمة' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header currentPage="articles" />
      <main>
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <Link 
              href="/articles"
              className="text-yellow-300 hover:text-yellow-200 mb-4 inline-block cursor-pointer"
            >
              ← العودة للمقالات
            </Link>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{article.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-4">{article.title}</h1>
            <div className="flex items-center gap-4 mt-4 text-gray-300">
              <span>👁️ {article.views.toLocaleString()} مشاهدة</span>
              <span>📅 {article.date}</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <div className="sticky top-20 bg-white rounded-xl shadow-lg p-4">
                <h3 className="font-bold text-gray-900 mb-4">محتويات المقال</h3>
                <nav className="space-y-2">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`block w-full text-right py-2 px-3 rounded-lg text-sm transition-colors cursor-pointer ${
                        activeSection === section.id 
                          ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            <div className="lg:w-3/4">
              <article className="bg-white rounded-xl shadow-lg p-8">
                {sections.map(section => (
                  <div 
                    key={section.id}
                    className={`mb-8 ${activeSection === section.id ? '' : 'hidden'}`}
                  >
                    <h2 className="text-2xl font-bold text-indigo-900 mb-4">{section.label}</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{article.content[section.id as keyof ArticleContent]}</p>
                    </div>
                  </div>
                ))}
              </article>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
