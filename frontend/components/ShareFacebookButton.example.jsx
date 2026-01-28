/**
 * Example usage of ShareFacebookButton component
 * 
 * This file demonstrates how to use the ShareFacebookButton component
 * in your React/Next.js application.
 */

import ShareFacebookButton from './ShareFacebookButton';

// Example 1: Basic usage with just the share URL
export function BasicExample() {
  const shareUrl = 'https://www.ahlamok.com/share?d=TEXT&i=INTERPRETATION';
  
  return (
    <ShareFacebookButton shareUrl={shareUrl}>
      Share on Facebook
    </ShareFacebookButton>
  );
}

// Example 2: With custom quote and hashtag
export function WithQuoteExample({ dreamText, interpretation }) {
  const shareUrl = `https://www.ahlamok.com/share?d=${encodeURIComponent(dreamText)}&i=${encodeURIComponent(interpretation)}`;
  const quote = `💭 حلم: ${dreamText}\n📖 التفسير: ${interpretation}`;
  const hashtag = '#Ahlamok';
  
  return (
    <ShareFacebookButton 
      shareUrl={shareUrl}
      quote={quote}
      hashtag={hashtag}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="#1877F2"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: '8px', verticalAlign: 'middle' }}
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      Share on Facebook
    </ShareFacebookButton>
  );
}

// Example 3: With custom styling
export function StyledExample({ shareUrl }) {
  return (
    <ShareFacebookButton 
      shareUrl={shareUrl}
      className="custom-facebook-btn"
      style={{
        backgroundColor: '#1877F2',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = '#166fe5'}
      onMouseLeave={(e) => e.target.style.backgroundColor = '#1877F2'}
    >
      Share on Facebook
    </ShareFacebookButton>
  );
}

// Example 4: Integration with the share page
export function SharePageIntegration({ searchParams }) {
  const d = searchParams?.d;
  const i = searchParams?.i;
  
  if (!d || !i) return null;
  
  const shareUrl = `https://www.ahlamok.com/share?d=${encodeURIComponent(d)}&i=${encodeURIComponent(i)}`;
  const quote = `💭 حلم: ${d}\n📖 التفسير: ${i}`;
  
  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h3>Share this interpretation</h3>
      <ShareFacebookButton 
        shareUrl={shareUrl}
        quote={quote}
        hashtag="#Ahlamok"
      />
    </div>
  );
}

// Example 5: Multiple share buttons
export function MultipleShareButtons({ shareUrl }) {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <ShareFacebookButton shareUrl={shareUrl}>
        Share on Facebook
      </ShareFacebookButton>
      
      {/* You can add other share buttons here */}
      {/* <ShareTwitterButton shareUrl={shareUrl} /> */}
      {/* <ShareWhatsAppButton shareUrl={shareUrl} /> */}
    </div>
  );
}
