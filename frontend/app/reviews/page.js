'use client';

import Link from 'next/link';
import BackgroundCanvas from '../../components/BackgroundCanvas';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Reviews() {
  const reviews = [
    {
      name: 'أحمد محمد',
      rating: 5,
      review: 'خدمة ممتازة في تفسير الأحلام. النتائج دقيقة جداً ومفيدة. ساعدتني في فهم حلمي بشكل أفضل.',
      date: '2024-01-15',
      location: 'الرياض، السعودية'
    },
    {
      name: 'فاطمة علي',
      rating: 5,
      review: 'تطبيق رائع! تفسير الأحلام بالذكاء الاصطناعي مذهل. النتائج سريعة والتفسيرات منطقية.',
      date: '2024-01-20',
      location: 'دبي، الإمارات'
    },
    {
      name: 'محمد حسن',
      rating: 4,
      review: 'جيد جداً. ساعدني في فهم رموز أحلامي. أتمنى إضافة المزيد من التفاصيل في التفسيرات.',
      date: '2024-01-25',
      location: 'القاهرة، مصر'
    },
    {
      name: 'سارة أحمد',
      rating: 5,
      review: 'أحب هذا التطبيق! تفسير أحلامي دقيق ومفصل. أنصح الجميع بتجربته.',
      date: '2024-02-01',
      location: 'جدة، السعودية'
    },
    {
      name: 'علي محمود',
      rating: 5,
      review: 'خدمة متميزة وموثوقة. الذكاء الاصطناعي يقدم تفسيرات ممتازة بناءً على المناهج التقليدية.',
      date: '2024-02-05',
      location: 'بيروت، لبنان'
    },
    {
      name: 'لينا خالد',
      rating: 4,
      review: 'تجربة جيدة. التفسيرات مفيدة وتساعد في التأمل. أتمنى تحسين الواجهة قليلاً.',
      date: '2024-02-10',
      location: 'عمان، الأردن'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#FFD700' : '#ddd', fontSize: '18px' }}>
        ★
      </span>
    ));
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
          تقييمات المستخدمين
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-gold), #b8860b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginRight: '15px'
                }}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    marginBottom: '5px',
                    color: 'var(--accent-gold)'
                  }}>
                    {review.name}
                  </h3>
                  <div style={{ marginBottom: '5px' }}>
                    {renderStars(review.rating)}
                  </div>
                  <p style={{
                    color: 'var(--text-sub)',
                    fontSize: '12px'
                  }}>
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>

              <p style={{
                color: 'var(--text-sub)',
                lineHeight: 1.6,
                flex: '1'
              }}>
                {review.review}
              </p>
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
            شارك تجربتك
          </h3>
          <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>
            أضف تقييمك وشارك تجربتك مع الآخرين.
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