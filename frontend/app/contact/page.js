import Link from 'next/link';

export const metadata = {
  title: 'تواصل معنا',
  description: 'لديك استفسار أو ملاحظة؟ تواصل مع فريق عمل موقع أحلامك.',
};

export default function Contact() {
  return (
    <div style={{ padding: 28, maxWidth: 900, margin: '40px auto', color: 'var(--text-main)', position: 'relative', zIndex: 1 }}>
      <Link href="/" className="btn-back">← العودة الرئيسية</Link>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28 }}>تواصل معنا</h1>

      <p style={{ marginTop: 12, color: 'var(--text-sub)', lineHeight: 1.7 }}>
        يسعدنا سماع ملاحظاتك أو استفساراتك حول الخدمة أو الإعلانات. يرجى مراسلتنا مباشرة عبر البريد الإلكتروني: <a href="mailto:Contact@ahlamok.com" style={{ color: 'var(--accent-gold)' }}>Contact@ahlamok.com</a>
      </p>

      <div style={{ marginTop: 20, color: 'var(--text-muted)', fontSize: 13 }}>
        عادةً نرد خلال 48 ساعة. إذا كان موضوعك طارئًا، ضع كلمة "عاجل" في الموضوع.
      </div>

    </div>
  );
}