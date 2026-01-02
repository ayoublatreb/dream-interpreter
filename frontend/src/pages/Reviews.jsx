import React from 'react';
import BackgroundCanvas from '../components/BackgroundCanvas';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Reviews() {
  const reviews = [
    {
      name: 'أحمد محمد',
      rating: 5,
      text: 'موقع رائع جداً! ساعدني في فهم أحلامي بشكل أفضل. التفسيرات دقيقة ومفيدة.',
      date: '2024-01-15'
    },
    {
      name: 'فاطمة علي',
      rating: 5,
      text: 'أحب التصميم والسهولة في الاستخدام. التسجيل الصوتي يعمل بشكل ممتاز.',
      date: '2024-01-20'
    },
    {
      name: 'محمد حسن',
      rating: 4,
      text: 'تجربة جيدة، لكن أتمنى إضافة المزيد من التفاصيل في التفسيرات.',
      date: '2024-01-25'
    },
    {
      name: 'سارة أحمد',
      rating: 5,
      text: 'شكراً لكم على هذا الموقع المفيد. ساعدني في حل مشكلة نفسية.',
      date: '2024-02-01'
    },
    {
      name: 'علي عبدالله',
      rating: 5,
      text: 'موقع موثوق وآمن. أنصح الجميع بتجربته.',
      date: '2024-02-05'
    },
    {
      name: 'مريم خالد',
      rating: 4,
      text: 'جيد جداً، لكن يحتاج إلى تحسين في السرعة قليلاً.',
      date: '2024-02-10'
    }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

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
          آراء المستخدمين
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {reviews.map((review, index) => (
            <div key={index} style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '15px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  margin: 0,
                  color: 'var(--accent-gold)'
                }}>
                  {review.name}
                </h3>
                <div style={{
                  color: '#ffd700',
                  fontSize: '16px'
                }}>
                  {renderStars(review.rating)}
                </div>
              </div>
              <p style={{
                color: 'var(--text-sub)',
                lineHeight: 1.6,
                margin: '10px 0'
              }}>
                "{review.text}"
              </p>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-sub)',
                textAlign: 'right'
              }}>
                {review.date}
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
            شارك رأيك
          </h3>
          <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>
            نحن نقدر آراءكم ونستخدمها لتحسين الخدمة. إذا كان لديك تجربة تريد مشاركتها، تواصل معنا.
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