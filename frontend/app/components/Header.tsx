'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-gradient-to-l from-indigo-900 via-purple-900 to-indigo-900 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <span className="text-3xl">🌙</span>
            <span className="text-xl font-bold">تفسير الأحلام</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'home' ? 'text-yellow-300' : ''}`}>الرئيسية</Link>
            <span className="mx-4"></span>
            <Link href="/articles" className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'articles' ? 'text-yellow-300' : ''}`}>المقالات</Link>
            <Link href="/categories" className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'categories' ? 'text-yellow-300' : ''}`}>التصنيفات</Link>
            <Link href="/about" className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'about' ? 'text-yellow-300' : ''}`}>من نحن</Link>
            <Link href="/contact" className={`hover:text-yellow-300 transition-colors cursor-pointer ${currentPage === 'contact' ? 'text-yellow-300' : ''}`}>تواصل معنا</Link>
          </nav>
          
          <button 
            className="md:hidden text-2xl cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-white/20">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block w-full text-right py-2 hover:text-yellow-300 cursor-pointer">الرئيسية</Link>
            <div className="my-2"></div>
            <Link href="/articles" onClick={() => setMobileMenuOpen(false)} className="block w-full text-right py-2 hover:text-yellow-300 cursor-pointer">المقالات</Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="block w-full text-right py-2 hover:text-yellow-300 cursor-pointer">التصنيفات</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block w-full text-right py-2 hover:text-yellow-300 cursor-pointer">من نحن</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block w-full text-right py-2 hover:text-yellow-300 cursor-pointer">تواصل معنا</Link>
          </div>
        )}
      </div>
    </header>
  );
}
