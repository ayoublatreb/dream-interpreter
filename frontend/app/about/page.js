import Link from 'next/link';

export const metadata = {
  title: 'عن التطبيق',
  description: 'اعرف المزيد عن موقع أحلامك، المنصة الرائدة لتفسير الأحلام باستخدام الذكاء الاصطناعي.',
};

export default function About() {
  return (
    <div style={{ padding: 28, maxWidth: 900, margin: '40px auto', color: 'var(--text-main)', position: 'relative', zIndex: 1 }}>
      <Link href="/" className="btn-back">← العودة الرئيسية</Link>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28 }}>عن Ahlamok</h1>

      <p style={{ marginTop: 12, color: 'var(--text-sub)', lineHeight: 1.8 }}>
        مرحبًا بك في Ahlamok — منصة متخصصة في مساعدة المستخدمين على استكشاف معاني أحلامهم بشكل سهل وآمن. نوفّر أدوات تفاعلية تسمح لك بكتابة حلمك أو تسجيله صوتيًا ثم الحصول على تفسير واضح ومبني على أنماط ودلالات نفسية وثقافية.
      </p>

      <h3 style={{ marginTop: 18 }}>كيف يعمل الموقع؟</h3>
      <ol style={{ color: 'var(--text-sub)', lineHeight: 1.8 }}>
        <li><strong>أدخل حلمك</strong>: يمكنك كتابة وصف مفصّل لحلمك أو تسجيله صوتيًا داخل التطبيق.</li>
        <li><strong>المعالجة</strong>: نقوم بتحويل التسجيل إلى نص عند الحاجة، ثم تحليله داخل النظام لاستخراج الرموز والعناصر الرئيسة.</li>
        <li><strong>التفسير</strong>: يعرض لك النظام تفسيرًا واضحًا مع نصائح لتأمل المعاني أو اتباع خطوات للتعامل مع المشاعر المرتبطة بالحلم.</li>
      </ol>

      <h3 style={{ marginTop: 18 }}>مزايا Ahlamok</h3>
      <ul style={{ color: 'var(--text-sub)', lineHeight: 1.8 }}>
        <li><strong>سهولة الاستخدام</strong>: واجهة بسيطة ومباشرة تناسب جميع المستخدمين.</li>
        <li><strong>دعم الصوت والنص</strong>: حرِّيّة اختيار الوسيلة التي تناسبك.</li>
        <li><strong>خصوصية وأمان</strong>: نلتزم بسياسة خصوصية واضحة ونحمي بيانات المستخدمين.</li>
        <li><strong>تجربة شخصية</strong>: نحاول تقديم تفسيرات حسّاسة وسياقية بدل الإجابات العامة.</li>
      </ul>

      <h3 style={{ marginTop: 18 }}>الفريق والرؤية</h3>
      <p style={{ color: 'var(--text-sub)', lineHeight: 1.7 }}>
        Ahlamok بدأت كرؤية بسيطة: تقديم مساحة آمنة وموضوعية لاستكشاف الأحلام. يعمل عليها فريق صغير من مطوّري الويب ومساهمين في المحتوى. نرحّب بالتعاون مع خبراء في علم النفس والثقافة لتقوية التفسيرات مستقبلًا.
      </p>

      <h3 style={{ marginTop: 18 }}>الأسئلة المتكررة (FAQ)</h3>
      <div style={{ color: 'var(--text-sub)', lineHeight: 1.7 }}>
        <p><strong>هل التفسيرات علمية؟</strong> التفسيرات تعتمد على أنماط وسياقات نفسية وثقافية وليست بديلة عن الاستشارة الطبية أو النفسية المتخصصة.</p>
        <p><strong>هل تحفظون أحلامي؟</strong> يتم حفظ البيانات حسب سياستنا للخصوصية ويمكنك طلب حذفها في أي وقت عبر صفحة التواصل.</p>
        <p><strong>هل يمكن استخدام التفسيرات لمشاركة على الشبكات الاجتماعية؟</strong> نعم، لكن نوصي بمراعاة خصوصيتك وعدم نشر تفاصيل حساسة.</p>
      </div>

      <h3 style={{ marginTop: 18 }}>التواصل والدعم</h3>
      <p style={{ color: 'var(--text-sub)', lineHeight: 1.7 }}>
        لأي استفسار أو شراكة أو ملاحظات، راسلنا على: <a href="mailto:Contact@ahlamok.com" style={{ color: 'var(--accent-gold)' }}>Contact@ahlamok.com</a>
      </p>


    </div>
  );
}