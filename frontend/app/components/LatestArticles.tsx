'use client';

import Link from 'next/link';
import { Article } from '../data/articles';

interface LatestArticlesProps {
  articles: Article[];
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            🕐 آخر المقالات
          </h2>
          <Link 
            href="/articles"
            className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            عرض الكل →
          </Link>
        </div>
        <div className="space-y-6">
          {articles.slice(0, 5).map(article => (
            <article 
              key={article.id}
              className="flex flex-col md:flex-row gap-6 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Link href={`/article/${article.id}`} className="flex flex-col md:flex-row gap-6 w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {article.image}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-indigo-600 font-semibold">{article.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>👁️ {article.views.toLocaleString()} مشاهدة</span>
                    <span>📅 {article.date}</span>
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
