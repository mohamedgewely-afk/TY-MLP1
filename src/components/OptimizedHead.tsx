
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OptimizedHeadProps {
  title?: string;
  description?: string;
  heroImageUrl?: string;
  canonicalUrl?: string;
}

const OptimizedHead: React.FC<OptimizedHeadProps> = ({
  title = "Toyota UAE - Official Website",
  description = "Discover the latest Toyota vehicles, hybrid technology, and exceptional service in the UAE. Book test drives, explore financing options, and find your perfect Toyota.",
  heroImageUrl,
  canonicalUrl
}) => {
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Critical preconnects for 80ms LCP savings per origin */}
      <link rel="preconnect" href="https://dam.alfuttaim.com" />
      <link rel="preconnect" href="https://www.toyota.com" />
      <link rel="preconnect" href="https://www.virtualshowroom.toyota.ae" />
      <link rel="preconnect" href="https://cdn.gpteng.co" />
      
      {/* DNS prefetch for additional origins */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      
      {/* Preload hero image for LCP optimization */}
      {heroImageUrl && (
        <>
          <link 
            rel="preload" 
            as="image" 
            href={heroImageUrl}
            fetchPriority="high"
          />
          {/* Preload modern formats */}
          <link 
            rel="preload" 
            as="image" 
            href={heroImageUrl.includes('unsplash.com') 
              ? `${heroImageUrl}&fm=avif&q=85&w=1200&h=675&fit=crop`
              : heroImageUrl
            }
            type="image/avif"
            fetchPriority="high"
          />
          <link 
            rel="preload" 
            as="image" 
            href={heroImageUrl.includes('unsplash.com') 
              ? `${heroImageUrl}&fm=webp&q=85&w=1200&h=675&fit=crop`
              : heroImageUrl
            }
            type="image/webp"
            fetchPriority="high"
          />
        </>
      )}
      
      {/* Critical CSS inlined for 150ms render-blocking savings */}
      <style>{`
        /* Critical above-the-fold styles */
        body { 
          margin: 0; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.5;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        /* Hero section critical styles */
        .hero-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        
        /* Loading skeleton */
        .hero-skeleton {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Prevent layout shift */
        img { 
          max-width: 100%; 
          height: auto; 
          display: block;
        }
        
        /* GPU acceleration for performance */
        .gpu-accelerated {
          transform: translate3d(0, 0, 0);
          will-change: transform;
          backface-visibility: hidden;
        }
        
        /* Header critical styles */
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        
        /* Navigation critical styles */
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
        }
        
        /* Button critical styles */
        .btn-primary {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      
      {/* Preload main CSS bundle and swap on load */}
      <link 
        rel="preload" 
        href="/src/index.css" 
        as="style" 
        onLoad={(e) => {
          const link = e.target as HTMLLinkElement;
          link.onload = null;
          link.rel = 'stylesheet';
        }}
      />
      
      {/* Fallback for browsers that don't support preload */}
      <noscript>{`<link rel="stylesheet" href="/src/index.css" />`}</noscript>
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Toyota UAE" />
      {heroImageUrl && <meta property="og:image" content={heroImageUrl} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {heroImageUrl && <meta name="twitter:image" content={heroImageUrl} />}
      
      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content="#eb0a1e" />
      <meta name="msapplication-TileColor" content="#eb0a1e" />
      
      {/* Defer non-critical scripts for main-thread work reduction */}
      <script defer src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
      <script defer src="https://cdn.gpteng.co/lovable.js" />
      
      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  );
};

export default OptimizedHead;
