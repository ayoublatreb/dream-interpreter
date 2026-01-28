/**
 * Integration Example: Adding Facebook Share Button to Share Page
 * 
 * This file shows how to integrate the ShareFacebookButton component
 * into the existing share page (frontend/app/share/page.js)
 */

// Page must be dynamic because it depends on searchParams
export const dynamic = "force-dynamic";

import ShareFacebookButton from '../../components/ShareFacebookButton';

export async function generateMetadata({ searchParams }) {
  const d = searchParams?.d || "تفسير الأحلام";
  const i = searchParams?.i || "احصل على تفسير دقيق لحلمك الآن";

  const dreamText = d.substring(0, 60);
  const interpretationText = i.substring(0, 250);

  return {
    title: `تفسير حلم: ${dreamText}`,
    description: `📖 التفسير: ${interpretationText}`,
    openGraph: {
      title: `💭 حلم: ${dreamText}`,
      description: `📖 التفسير: ${interpretationText}`,
      type: "article",
      locale: "ar_AR",
      siteName: "Ahlamok - تفسير الأحلام",
      url: `https://www.ahlamok.com/share?d=${encodeURIComponent(d)}&i=${encodeURIComponent(i)}`,
      images: [
        {
          url: "https://www.ahlamok.com/dream-icon.png",
          width: 1200,
          height: 630,
          alt: "تفسير الأحلام",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `💭 حلم: ${dreamText}`,
      description: `📖 التفسير: ${interpretationText}`,
      images: ["https://www.ahlamok.com/dream-icon.png"],
    },
  };
}

export default function SharePage({ searchParams }) {
  const d = searchParams?.d;
  const i = searchParams?.i;

  // Build the share URL
  const shareUrl = `https://www.ahlamok.com/share?d=${encodeURIComponent(d || "")}&i=${encodeURIComponent(i || "")}`;
  
  // Build the quote for Facebook (optional)
  const quote = d && i 
    ? `💭 حلم: ${d}\n📖 التفسير: ${i}`
    : '';

  return (
    <main style={{ padding: "24px", direction: "rtl", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>💤 تفسير الحلم</h1>

      {d && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>💭 الحلم</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
            {d}
          </p>
        </div>
      )}

      {i && (
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>📖 التفسير</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", backgroundColor: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
            {i}
          </p>
        </div>
      )}

      {/* Share Section */}
      {d && i && (
        <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "16px", textAlign: "center" }}>
            شارك هذا التفسير
          </h3>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            {/* Facebook Share Button */}
            <ShareFacebookButton 
              shareUrl={shareUrl}
              quote={quote}
              hashtag="#Ahlamok"
              style={{
                backgroundColor: "#1877F2",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                transition: "background-color 0.2s",
                fontFamily: "inherit",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: "8px", verticalAlign: "middle" }}
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              مشاركة على فيسبوك
            </ShareFacebookButton>
          </div>
          
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
            شارك تفسير حلمك مع أصدقائك على فيسبوك
          </p>
        </div>
      )}

      {/* Back to Full Interpretation Link */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <a
          href={`/?d=${encodeURIComponent(d || "")}&i=${encodeURIComponent(i || "")}`}
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "600",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.background = "#1d4ed8"}
          onMouseLeave={(e) => e.target.style.background = "#2563eb"}
        >
          🔍 عرض التفسير الكامل
        </a>
      </div>
    </main>
  );
}
