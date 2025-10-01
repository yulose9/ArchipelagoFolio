import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
});

// SEO metadata
export const metadata: Metadata = {
  title: {
    default: 'John Doe - Full-Stack Developer & Digital Innovator',
    template: '%s | John Doe Portfolio',
  },
  description: 'Interactive 3D portfolio showcasing full-stack development expertise, innovative projects, and digital solutions. Built with Next.js, TypeScript, and Mapbox GL.',
  keywords: [
    'full-stack developer',
    'web developer',
    'react developer',
    'next.js',
    'typescript',
    'portfolio',
    '3d map',
    'mapbox',
    'philippines',
    'interactive design',
  ],
  authors: [{ name: 'John Doe' }],
  creator: 'John Doe',
  publisher: 'John Doe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://johndoe-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://johndoe-portfolio.vercel.app',
    title: 'John Doe - Interactive 3D Portfolio',
    description: 'Explore an innovative portfolio featuring a 3D map of the Philippines and cutting-edge web development projects.',
    siteName: 'John Doe Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'John Doe Portfolio - Interactive 3D Map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'John Doe - Interactive 3D Portfolio',
    description: 'Explore an innovative portfolio featuring a 3D map of the Philippines and cutting-edge web development projects.',
    images: ['/og-image.jpg'],
    creator: '@johndoe',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component for the portfolio application
 * Provides global styles, fonts, metadata, and analytics
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mapbox.com" />
        
        {/* Mapbox CSS */}
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
          rel="stylesheet"
        />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Analytics - Replace with your actual analytics code */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`
          font-inter antialiased bg-black text-white
          selection:bg-blue-500/20 selection:text-white
          scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent
        `}
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-white text-black px-4 py-2 rounded-md z-[9999] 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>

        {/* Main content wrapper */}
        <div id="main-content" className="min-h-screen">
          {children}
        </div>

        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded">
            <div>Screen: <span className="sm:hidden">XS</span><span className="hidden sm:inline md:hidden">SM</span><span className="hidden md:inline lg:hidden">MD</span><span className="hidden lg:inline xl:hidden">LG</span><span className="hidden xl:inline 2xl:hidden">XL</span><span className="hidden 2xl:inline">2XL</span></div>
          </div>
        )}

        {/* Performance monitoring script */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Web Vitals monitoring
                function sendToAnalytics(metric) {
                  // Replace with your analytics endpoint
                  console.log('Web Vital:', metric);
                }
                
                // Monitor Core Web Vitals
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                      sendToAnalytics({name: 'LCP', value: entry.startTime});
                    }
                  }
                }).observe({type: 'largest-contentful-paint', buffered: true});
                
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.hadRecentInput) continue;
                    sendToAnalytics({name: 'CLS', value: entry.value});
                  }
                }).observe({type: 'layout-shift', buffered: true});
                
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    sendToAnalytics({name: 'FID', value: entry.processingStart - entry.startTime});
                  }
                }).observe({type: 'first-input', buffered: true});
              `,
            }}
          />
        )}
        <Analytics />
      </body>
    </html>
  );
}