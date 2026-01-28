# ShareFacebookButton Component

A reliable, production-ready Facebook Share button component for React/Next.js applications.

## Overview

This component provides a robust solution for sharing content on Facebook using the official Facebook share dialog. It handles popup blockers, mobile/desktop differences, and provides fallback behavior when needed.

## Features

✅ **Popup Window on Desktop** - Opens Facebook share dialog in a centered popup (600x400px)  
✅ **Mobile Optimization** - Uses full page redirect on mobile devices for better UX  
✅ **Popup Blocker Handling** - Automatically falls back to full page redirect if popup is blocked  
✅ **Direct User Click** - Popup only opens on direct user interaction (avoids popup blockers)  
✅ **UX Feedback** - Shows helpful message "Vous devez être connecté à Facebook"  
✅ **No SDK Required** - Uses official Facebook sharer.php endpoint (no API keys needed)  
✅ **Customizable** - Supports custom quotes, hashtags, and styling  
✅ **Accessible** - Includes proper ARIA labels  
✅ **Production Ready** - Clean, well-commented, and thoroughly tested

## Installation

Simply copy the `ShareFacebookButton.jsx` file to your components directory:

```
frontend/components/ShareFacebookButton.jsx
```

## Usage

### Basic Usage

```jsx
import ShareFacebookButton from './components/ShareFacebookButton';

function MyComponent() {
  const shareUrl = 'https://www.ahlamok.com/share?d=TEXT&i=INTERPRETATION';
  
  return (
    <ShareFacebookButton shareUrl={shareUrl}>
      Share on Facebook
    </ShareFacebookButton>
  );
}
```

### With Quote and Hashtag

```jsx
<ShareFacebookButton 
  shareUrl={shareUrl}
  quote="Check out this dream interpretation!"
  hashtag="#Ahlamok"
>
  Share on Facebook
</ShareFacebookButton>
```

### With Custom Styling

```jsx
<ShareFacebookButton 
  shareUrl={shareUrl}
  className="my-custom-button"
  style={{
    backgroundColor: '#1877F2',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
  }}
>
  Share on Facebook
</ShareFacebookButton>
```

### Integration with Share Page

```jsx
export default function SharePage({ searchParams }) {
  const d = searchParams?.d;
  const i = searchParams?.i;
  
  const shareUrl = `https://www.ahlamok.com/share?d=${encodeURIComponent(d)}&i=${encodeURIComponent(i)}`;
  const quote = `💭 حلم: ${d}\n📖 التفسير: ${i}`;
  
  return (
    <div>
      {/* Your existing content */}
      
      <ShareFacebookButton 
        shareUrl={shareUrl}
        quote={quote}
        hashtag="#Ahlamok"
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `shareUrl` | `string` | ✅ Yes | - | The URL to share on Facebook |
| `quote` | `string` | No | `''` | Optional quote/description to pre-fill in the share dialog |
| `hashtag` | `string` | No | `''` | Optional hashtag (e.g., `#Ahlamok`) |
| `className` | `string` | No | `''` | Additional CSS class for styling |
| `children` | `ReactNode` | No | Default button content | Custom button content (icon, text, etc.) |

## How It Works

### Why This Approach Is Reliable

#### 1. **Uses Official Facebook Share Endpoint**
The component uses `https://www.facebook.com/sharer/sharer.php`, which is Facebook's official share dialog endpoint. This is:
- **Stable**: Facebook maintains this endpoint for sharing
- **No API Required**: No need for Facebook SDK, API keys, or app registration
- **Policy Compliant**: Respects Facebook's sharing policies (no auto-sharing)

#### 2. **Popup Window on Desktop**
On desktop devices, the component opens a centered popup window (600x400px) with:
- Proper positioning (centered on screen)
- Standard popup features (resizable, scrollbars)
- Focus management (popup receives focus when opened)

#### 3. **Mobile Optimization**
On mobile devices, the component uses a full page redirect instead of a popup because:
- Mobile browsers handle popups differently
- Full page redirect provides better UX on mobile
- Avoids mobile-specific popup blocking issues

#### 4. **Popup Blocker Detection**
The component detects if a popup was blocked by checking:
```javascript
if (!popup || popup.closed || typeof popup.closed === 'undefined') {
  // Popup was blocked, fall back to full page redirect
  window.location.href = finalShareUrl;
}
```

If blocked, it automatically falls back to a full page redirect.

#### 5. **Direct User Click Requirement**
Popup blockers only allow popups that are triggered by direct user interactions. This component:
- Uses `onClick` handler (direct user interaction)
- Does NOT use `useEffect` or `onLoad` (would be blocked)
- Does NOT use `setTimeout` (would be blocked)

#### 6. **UX Feedback**
When the popup opens successfully, the component shows a helpful message:
```
"Vous devez être connecté à Facebook"
```
This message:
- Appears with a smooth fade-in animation
- Auto-hides after 5 seconds
- Helps users understand they need to be logged into Facebook

#### 7. **No Facebook SDK or API**
The component does NOT use:
- Facebook JavaScript SDK
- Facebook Graph API
- Facebook Login SDK
- Any API keys or app registration

This makes it:
- **Simpler**: No setup or configuration required
- **More Reliable**: No dependency on external SDKs
- **Policy Compliant**: No risk of violating Facebook's policies

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ IE11 (with polyfills for ES6 features)

## Common Issues and Solutions

### Issue: Popup is blocked

**Solution**: The component automatically falls back to full page redirect. No action needed.

### Issue: User sees Facebook login page instead of share dialog

**Explanation**: This is expected behavior if the user is not logged into Facebook. The component shows a helpful message: "Vous devez être connecté à Facebook".

**Solution**: User needs to log into Facebook first, then the share dialog will appear.

### Issue: Popup opens but shows wrong content

**Solution**: Ensure the `shareUrl` prop is correctly formatted and URL-encoded:
```javascript
const shareUrl = `https://www.ahlamok.com/share?d=${encodeURIComponent(d)}&i=${encodeURIComponent(i)}`;
```

### Issue: Button doesn't work on mobile

**Solution**: The component uses full page redirect on mobile by design. This is intentional for better mobile UX.

## Facebook Policy Compliance

This component is fully compliant with Facebook's sharing policies:

✅ **No Auto-Sharing**: Content is only shared when user explicitly clicks the button  
✅ **No Pre-filled Content**: The `quote` parameter is optional and user can edit it  
✅ **No Deceptive Behavior**: Clear button label and expected behavior  
✅ **No API Abuse**: Uses official share endpoint, not API  
✅ **User Control**: User has full control over what gets shared

## Performance Considerations

- **Lightweight**: No external dependencies or SDKs
- **Fast**: Minimal JavaScript overhead
- **No Network Requests**: Component doesn't make any API calls
- **Client-Side Only**: Runs entirely in the browser

## Security Considerations

- **XSS Prevention**: All URLs are properly encoded using `encodeURIComponent`
- **No Sensitive Data**: No API keys or tokens are used
- **HTTPS Only**: Facebook share endpoint requires HTTPS
- **Same-Origin Policy**: Popup opens Facebook's domain, not your domain

## Testing

To test the component:

1. **Desktop Testing**:
   - Click the button on desktop browser
   - Verify popup opens in centered window
   - Verify share dialog appears (if logged into Facebook)

2. **Mobile Testing**:
   - Click the button on mobile device
   - Verify full page redirect to Facebook
   - Verify share dialog appears (if logged into Facebook)

3. **Popup Blocker Testing**:
   - Enable popup blocker in browser
   - Click the button
   - Verify fallback to full page redirect works

4. **Not Logged In Testing**:
   - Log out of Facebook
   - Click the button
   - Verify helpful message appears
   - Verify login page appears in popup/redirect

## License

This component is provided as-is for use in your project.

## Support

For issues or questions, please refer to the example usage file: `ShareFacebookButton.example.jsx`
