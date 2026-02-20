'use client';

import Link from 'next/link';
import { Article } from '../data/articles';

interface FeaturedArticlesProps {
  articles: Article[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const featured = articles.slice(0, 3);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
          📚 المقالات المميزة
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featured.map(article => (
            <article 
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
            >
              <Link href={`/article/${article.id}`}>
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-7xl">
                  {article.image}
                </div>
                <div className="p-6">
                  <span className="text-sm text-indigo-600 font-semibold">{article.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 line-clamp-2">{article.title}</h3>
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
      </div>
    </section>
  );
}
