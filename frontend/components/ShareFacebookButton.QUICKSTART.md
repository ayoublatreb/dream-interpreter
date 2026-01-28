# Quick Start Guide - ShareFacebookButton

Get up and running with the Facebook Share button in 5 minutes.

## Step 1: Copy the Component

Copy [`ShareFacebookButton.jsx`](ShareFacebookButton.jsx) to your components directory:

```
frontend/components/ShareFacebookButton.jsx
```

## Step 2: Import and Use

```jsx
import ShareFacebookButton from './components/ShareFacebookButton';

export default function MyPage() {
  const shareUrl = 'https://www.ahlamok.com/share?d=TEXT&i=INTERPRETATION';
  
  return (
    <ShareFacebookButton shareUrl={shareUrl}>
      Share on Facebook
    </ShareFacebookButton>
  );
}
```

## Step 3: Test It

1. Click the button
2. Verify the Facebook share dialog opens (or login page if not logged in)
3. Done! 🎉

---

## Integration with Your Share Page

Replace your existing [`frontend/app/share/page.js`](../app/share/page.js) with this:

```jsx
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
  };
}

export default function SharePage({ searchParams }) {
  const d = searchParams?.d;
  const i = searchParams?.i;

  const shareUrl = `https://www.ahlamok.com/share?d=${encodeURIComponent(d || "")}&i=${encodeURIComponent(i || "")}`;
  const quote = d && i ? `💭 حلم: ${d}\n📖 التفسير: ${i}` : '';

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

      {/* Facebook Share Button */}
      {d && i && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <ShareFacebookButton 
            shareUrl={shareUrl}
            quote={quote}
            hashtag="#Ahlamok"
          />
        </div>
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
```

---

## Common Props

| Prop | Required | Example |
|------|----------|---------|
| `shareUrl` | ✅ Yes | `'https://www.ahlamok.com/share?d=TEXT&i=INTERPRETATION'` |
| `quote` | No | `'Check out this dream interpretation!'` |
| `hashtag` | No | `'#Ahlamok'` |
| `className` | No | `'my-custom-button'` |
| `children` | No | `'Share on Facebook'` |

---

## Troubleshooting

### Issue: Popup is blocked

**Solution**: The component automatically falls back to full page redirect. No action needed.

### Issue: User sees Facebook login page

**Explanation**: This is expected if the user is not logged into Facebook. The component shows a helpful message: "Vous devez être connecté à Facebook".

**Solution**: User needs to log into Facebook first.

### Issue: Button doesn't work on mobile

**Explanation**: The component uses full page redirect on mobile by design for better UX.

**Solution**: This is intentional behavior.

---

## Need More Help?

- See [`ShareFacebookButton.README.md`](ShareFacebookButton.README.md) for full documentation
- See [`ShareFacebookButton.example.jsx`](ShareFacebookButton.example.jsx) for more examples
- See [`ShareFacebookButton.TECHNICAL.md`](ShareFacebookButton.TECHNICAL.md) for technical details
