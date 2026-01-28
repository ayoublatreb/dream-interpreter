'use client';

import { useState } from 'react';

/**
 * ShareFacebookButton - A reliable Facebook Share button component
 * 
 * This component opens the official Facebook share dialog in a popup window.
 * It handles popup blockers, mobile/desktop differences, and provides fallback behavior.
 * 
 * Key Features:
 * - Opens Facebook share dialog in a popup (not full page redirect)
 * - Popup opens only on direct user click (avoids popup blockers)
 * - Fallback to full page redirect if popup is blocked
 * - Mobile-aware: uses full page redirect on mobile devices
 * - Shows helpful UX message about Facebook login requirement
 * - No Facebook SDK or API required (uses official share URL)
 * 
 * @param {Object} props
 * @param {string} props.shareUrl - The URL to share (e.g., https://www.ahlamok.com/share?d=TEXT&i=INTERPRETATION)
 * @param {string} props.quote - Optional quote/description to pre-fill in the share dialog
 * @param {string} props.hashtag - Optional hashtag (e.g., #Ahlamok)
 * @param {string} props.className - Optional CSS class for styling
 * @param {React.ReactNode} props.children - Button content (icon, text, etc.)
 */
export default function ShareFacebookButton({
  shareUrl,
  quote = '',
  hashtag = '',
  className = '',
  children,
}) {
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  /**
   * Detects if the current device is mobile
   * Mobile devices often handle popups differently, so we use full page redirect
   */
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  /**
   * Opens the Facebook share dialog
   * 
   * On desktop: Opens in a popup window with proper dimensions
   * On mobile: Opens in the same tab (better UX on mobile)
   * If popup is blocked: Falls back to full page redirect
   */
  const handleShare = (e) => {
    e.preventDefault();

    // Build the Facebook share URL
    // Using the official sharer.php endpoint
    const fbShareUrl = new URL('https://www.facebook.com/sharer/sharer.php');
    fbShareUrl.searchParams.set('u', shareUrl);
    
    if (quote) {
      fbShareUrl.searchParams.set('quote', quote);
    }
    
    if (hashtag) {
      fbShareUrl.searchParams.set('hashtag', hashtag);
    }

    const finalShareUrl = fbShareUrl.toString();

    // On mobile, use full page redirect (better UX)
    if (isMobile()) {
      window.location.href = finalShareUrl;
      return;
    }

    // On desktop, try to open in a popup window
    const popupWidth = 600;
    const popupHeight = 400;
    
    // Calculate center position for the popup
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;

    // Popup window features
    const popupFeatures = [
      `width=${popupWidth}`,
      `height=${popupHeight}`,
      `left=${left}`,
      `top=${top}`,
      'resizable=yes',
      'scrollbars=yes',
      'status=yes',
      'menubar=no',
      'toolbar=no',
      'location=no',
    ].join(',');

    // Try to open the popup
    const popup = window.open(finalShareUrl, 'facebook-share', popupFeatures);

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Popup was blocked, fall back to full page redirect
      window.location.href = finalShareUrl;
    } else {
      // Popup opened successfully
      // Focus the popup (some browsers require this)
      if (popup.focus) {
        popup.focus();
      }
      
      // Show helpful message about Facebook login
      setShowLoginMessage(true);
      
      // Hide the message after 5 seconds
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 5000);
    }
  };

  return (
    <div className="facebook-share-container">
      <button
        onClick={handleShare}
        className={`facebook-share-button ${className}`}
        type="button"
        aria-label="Share on Facebook"
      >
        {children || (
          <>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '8px', verticalAlign: 'middle' }}
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Share on Facebook
          </>
        )}
      </button>

      {/* Helpful UX message about Facebook login */}
      {showLoginMessage && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: '#f0f2f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#1c1e21',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          Vous devez être connecté à Facebook
        </div>
      )}

      {/* Inline styles for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
