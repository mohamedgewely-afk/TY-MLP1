
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add viewport meta tag to support safe area insets
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
document.getElementsByTagName('head')[0].appendChild(meta);

// Add PWA manifest
const manifestLink = document.createElement('link');
manifestLink.rel = 'manifest';
manifestLink.href = '/manifest.json';
document.getElementsByTagName('head')[0].appendChild(manifestLink);

// Add theme color
const themeColor = document.createElement('meta');
themeColor.name = 'theme-color';
themeColor.content = '#eb0a1e';
document.getElementsByTagName('head')[0].appendChild(themeColor);

// Add apple touch icon
const appleTouchIcon = document.createElement('link');
appleTouchIcon.rel = 'apple-touch-icon';
appleTouchIcon.href = '/icon-192.png';
document.getElementsByTagName('head')[0].appendChild(appleTouchIcon);

createRoot(document.getElementById("root")!).render(<App />);
