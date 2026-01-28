// Page must be dynamic because it depends on searchParams
export const dynamic = "force-dynamic";

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

  return (
    <main style={{ padding: "24px", direction: "rtl" }}>
      <h1>💤 تفسير الحلم</h1>

      {d && (
        <>
          <h2>💭 الحلم</h2>
          <p>{d}</p>
        </>
      )}

      {i && (
        <>
          <h2>📖 التفسير</h2>
          <p>{i}</p>
        </>
      )}

      <a
        href={`/?d=${encodeURIComponent(d || "")}&i=${encodeURIComponent(i || "")}`}
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 16px",
          background: "#2563eb",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        🔍 عرض التفسير الكامل
      </a>
    </main>
  );
}
