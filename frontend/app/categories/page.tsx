'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { articles, categories } from '../data/articles';
import { Article } from '../data/articles';

function CategoriesContent() {
  const searchParams = useSearchParams();
  const selectedCatParam = searchParams.get('cat');
  const [selectedCat, setSelectedCat] = useState<string | null>(selectedCatParam);
  
  const filteredArticles = selectedCat 
    ? articles.filter((a: Article) => a.category === selectedCat)
    : articles;
  
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setSelectedCat(null)}
          className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
            selectedCat === null 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          <span className="text-3xl block mb-2">📚</span>
          <span className="font-semibold">الكل</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.name)}
            className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
              selectedCat === cat.name 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            <span className="text-3xl block mb-2">{cat.icon}</span>
            <span className="font-semibold">{cat.name}</span>
            <p className="text-sm text-gray-500">{cat.count} مقال</p>
          </button>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article: Article) => (
          <article 
            key={article.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
          >
            <Link href={`/article/${article.id}`}>
              <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl">
                {article.image}
              </div>
              <div className="p-6">
                <span className="text-sm text-indigo-600 font-semibold">{article.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>👁️ {article.views.toLocaleString()} مشاهدة</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <Header currentPage="categories" />
      <main className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          📂 تصفح حسب التصنيف
        </h1>
        
        <Suspense fallback={<div className="text-center py-10">جاري التحميل...</div>}>
          <CategoriesContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
