'use client';

import Link from 'next/link';
import BackgroundCanvas from '../../components/BackgroundCanvas';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Articles() {
  const articles = [
    {
      title: 'تفسير حلم السقوط',
      excerpt: 'يُعتبر حلم السقوط من الأحلام الشائعة التي يراها الكثيرون. يرمز هذا الحلم إلى الشعور بالقلق أو فقدان السيطرة في الحياة.',
      content: 'تفصيلاً، يمكن أن يعكس حلم السقوط شعوراً بالخوف من الفشل أو الانهيار في جوانب معينة من الحياة. ومع ذلك، قد يكون إشارة إيجابية في بعض الحالات، مثل الحاجة إلى التخلص من الأعباء أو البدء من جديد.',
      date: '2024-01-10',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'شخص يسقط من مكان مرتفع في الحلم'
    },
    {
      title: 'رموز الألوان في الأحلام',
      excerpt: 'تلعب الألوان دوراً هاماً في تفسير الأحلام. كل لون يحمل معاني مختلفة تعكس المشاعر والأفكار.',
      content: 'الأحمر يرمز إلى الطاقة والعاطفة، الأزرق إلى الهدوء والسلام، الأسود إلى الغموض أو الحزن، بينما الأبيض يمثل النقاء والجديد. فهم هذه الرموز يساعد في تفسير الأحلام بشكل أفضل.',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'قوس قزح ملون في السماء'
    },
    {
      title: 'حلم الطيران والحرية',
      excerpt: 'حلم الطيران يعبر عن الرغبة في الحرية والانعتاق من القيود. إنه رمز للنجاح والارتفاع في الحياة.',
      content: 'في علم النفس، يُفسر حلم الطيران كتعبير عن الثقة بالنفس والقدرة على التغلب على العقبات. إذا كنت تشعر بالسعادة أثناء الطيران في الحلم، فهذا يشير إلى فترة إيجابية قادمة.',
      date: '2024-01-20',
      image: 'https://images.unsplash.com/photo-1508804052814-cd3ba865a116?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'شخص يطير في السماء'
    },
    {
      title: 'تفسير حلم المطر الغزير',
      excerpt: 'رؤية المطر الغزير في المنام من الرؤى التي تحمل دلالات إيجابية وأحياناً تحذيرية حسب سياق الحلم.',
      content: `
    المطر الغزير في المنام يرمز غالباً إلى الخير والرزق الواسع وتجدد الأمل بعد فترة من التعب أو الضيق. وقد يدل على رحمة إلهية أو انفراج قريب في حياة الرائي.
    
    إذا كان المطر نافعاً وغير مُسبب للضرر، فهو إشارة إلى الاستقرار والطمأنينة، أما إذا كان شديداً ومُدمراً فقد يعكس مشاعر قلق أو ضغوط نفسية يعيشها الحالم.
    
    كما قد يرتبط هذا الحلم بالتطهير الداخلي وبداية مرحلة جديدة أكثر إيجابية.
      `,
      date: '2024-02-12',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      imageAlt: 'المطر الغزير يرمز للخير والتجدد في المنام'
    },
    {
      title: 'الماء في الأحلام: رمز الحياة والعواطف',
      excerpt: 'يحمل الماء في الأحلام معاني متعددة تتعلق بالعواطف والتغييرات في الحياة.',
      content: 'الماء الهادئ يمثل السلام والوضوح، بينما الماء المتلاطم يشير إلى العواطف المضطربة. الغرق قد يعبر عن الشعور بالغرق في المشاكل، والسباحة عن التكيف مع التغييرات.',
      date: '2024-02-01',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'محيط هادئ'
    },
    {
      title: 'حلم الموت والتجديد',
      excerpt: 'حلم الموت لا يعني دائماً شيئاً سيئاً. في كثير من الحالات، يرمز إلى التجديد والتغيير.',
      content: 'في علم النفس، يُفسر حلم الموت كرمز لنهاية مرحلة وبداية أخرى. قد يشير إلى الحاجة للتخلص من عادات قديمة أو بدء حياة جديدة. المهم هو السياق العام للحلم.',
      date: '2024-02-05',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
      imageAlt: 'شمس تشرق فوق الجبال'
    }
  ];

  return (
    <>
      <BackgroundCanvas />
      <Navbar />
      <div style={{
        padding: '28px',
        maxWidth: '900px',
        margin: '80px auto 40px',
        color: 'var(--text-main)',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '28px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          مقالات في تفسير الأحلام
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {articles.map((article, index) => (
            <div key={index} style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '15px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Article Image */}
              <div style={{
                width: '100%',
                height: '200px',
                marginBottom: '15px',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    filter: 'brightness(0.9)'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                        <rect width="400" height="300" fill="#2d2d2d"/>
                        <text x="50%" y="50%" text-anchor="middle" fill="#888" font-family="Arial" font-size="16">
                          صورة غير متوفرة
                        </text>
                        <rect x="50" y="120" width="300" height="60" fill="#444" rx="8"/>
                        <text x="50%" y="160" text-anchor="middle" fill="#ccc" font-family="Arial" font-size="14">
                          ${article.title}
                        </text>
                      </svg>
                    `);
                  }}
                />
              </div>

              <h3 style={{
                fontSize: '20px',
                marginBottom: '10px',
                color: 'var(--accent-gold)',
                flex: '1'
              }}>
                {article.title}
              </h3>
              <p style={{
                color: 'var(--text-sub)',
                lineHeight: 1.6,
                marginBottom: '10px'
              }}>
                {article.excerpt}
              </p>
              <p style={{
                color: 'var(--text-sub)',
                fontSize: '14px',
                marginBottom: '15px',
                flex: '1'
              }}>
                {article.content}
              </p>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-sub)',
                textAlign: 'right',
                marginTop: 'auto'
              }}>
                {article.date}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '15px',
          border: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>
            تريد معرفة المزيد؟
          </h3>
          <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>
            اشترك في نشرتنا الإخبارية للحصول على مقالات جديدة حول تفسير الأحلام.
          </p>
          <a
            href="/contact"
            style={{
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '10px 20px',
              border: '1px solid var(--accent-gold)',
              borderRadius: '8px',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(212, 175, 55, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
            }}
          >
            تواصل معنا
          </a>
        </div>
      </div>

      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        direction: 'ltr',
        margin: '0 auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '900px',
          padding: '20px 18px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Footer />
        </div>
      </div>
    </>
  );
}