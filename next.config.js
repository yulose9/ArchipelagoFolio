/**
 * Next.js configuration for portfolio application
 * Optimized for 3D map features and performance
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Basic configuration
    reactStrictMode: true,
    swcMinify: true,

    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Image optimization
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 768, 1024, 1280, 1600],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // 1 year
    },

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            },
            {
                source: '/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    },

    // Redirects
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true
            }
        ];
    },

    // Environment variables
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },

    // Webpack configuration
    webpack: (config, { dev, isServer, webpack }) => {
        // Optimization for Mapbox GL
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }

        // Bundle splitting for better caching
        if (!dev && !isServer) {
            config.optimization.splitChunks.cacheGroups = {
                ...config.optimization.splitChunks.cacheGroups,
                mapbox: {
                    name: 'mapbox',
                    test: /[\\/]node_modules[\\/]mapbox-gl[\\/]/,
                    chunks: 'all',
                    priority: 10,
                },
                framerMotion: {
                    name: 'framer-motion',
                    test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                    chunks: 'all',
                    priority: 10,
                },
            };
        }

        // Add webpack plugins for development
        if (dev) {
            config.plugins.push(
                new webpack.DefinePlugin({
                    __DEV__: JSON.stringify(true),
                })
            );
        }

        return config;
    },

    // Experimental features
    experimental: {
        scrollRestoration: true,
        optimizeCss: true,
    },

    // Output configuration
    output: 'standalone',

    // Trailing slash configuration
    trailingSlash: false,

    // Power by header
    poweredByHeader: false,

    // Compression
    compress: true,

    // Generate build ID
    generateBuildId: async () => {
        return `build-${Date.now()}`;
    },
};

module.exports = nextConfig;