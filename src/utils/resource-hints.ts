
// Resource hints and preloading optimization
export const addResourceHints = () => {
  if (typeof document === 'undefined') return;

  const hints = [
    // Preconnect to critical domains
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    
    // DNS prefetch for potential third-party domains
    { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    
    // Preload critical fonts
    { 
      rel: 'preload', 
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      as: 'style'
    }
  ];

  hints.forEach(hint => {
    const existingLink = document.querySelector(`link[href="${hint.href}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      Object.assign(link, hint);
      if (hint.crossOrigin) {
        link.crossOrigin = hint.crossOrigin;
      }
      document.head.appendChild(link);
    }
  });
};

// Initialize resource hints
if (typeof window !== 'undefined') {
  // Use scheduler if available, otherwise setTimeout
  if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
    (window as any).scheduler.postTask(addResourceHints, { priority: 'background' });
  } else {
    setTimeout(addResourceHints, 100);
  }
}
