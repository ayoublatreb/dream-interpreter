'use client';

import Link from 'next/link';
import { Category } from '../data/articles';

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          📂 التصنيفات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/categories?cat=${encodeURIComponent(cat.name)}`}
              className="bg-white/10 backdrop-blur hover:bg-white/20 rounded-xl p-6 text-center transition-all transform hover:scale-105 cursor-pointer block"
            >
              <span className="text-5xl mb-3 block">{cat.icon}</span>
              <h3 className="text-xl font-bold">{cat.name}</h3>
              <p className="text-gray-300 text-sm mt-1">{cat.count} مقال</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
