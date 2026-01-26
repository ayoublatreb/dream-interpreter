import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 40,
      padding: 24,
      textAlign: 'center',
      color: 'var(--text-muted)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      direction: 'ltr'
    }}>
      <div style={{
        display: 'flex',
        gap: 18,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%'
      }}>
        <Link href="/privacy" style={{ color: 'var(--text-sub)', textDecoration: 'none' }}>سياسة الخصوصية</Link>
        <Link href="/about" style={{ color: 'var(--text-sub)', textDecoration: 'none' }}>نبذة عن الموقع</Link>
        <Link href="/contact" style={{ color: 'var(--text-sub)', textDecoration: 'none' }}>تواصل معنا</Link>
      </div>

      <div style={{ marginTop: 12, fontSize: 13, width: '100%' }}>
        © {new Date().getFullYear()} أحلامك — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}