'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-bl from-indigo-900 via-purple-900 to-indigo-900 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-8xl animate-pulse">🌙</div>
        <div className="absolute top-20 right-20 text-6xl animate-bounce">⭐</div>
        <div className="absolute bottom-20 left-1/4 text-7xl animate-pulse">✨</div>
        <div className="absolute bottom-10 right-1/3 text-5xl animate-bounce">🌟</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            أكبر موقع متخصص في <span className="text-yellow-300">تفسير الأحلام</span> والرؤى
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            اكتشف دلالات أحلامك ورؤاكم من خلال أقوال العلماء والمعاصرين. تفسير دقيق ومفصل لكل حلم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/articles"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg cursor-pointer inline-block"
            >
              تصفح المقالات
            </Link>
            <Link 
              href="/categories"
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold py-4 px-8 rounded-full transition-all border border-white/30 cursor-pointer inline-block"
            >
              استكشف التصنيفات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
