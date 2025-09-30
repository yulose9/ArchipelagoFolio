# Production Build and Deployment Guide

## Overview

This guide covers production build optimization and deployment configuration for the Interactive 3D Map Portfolio application.

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure the following environment variables are set in your production environment:

```bash
# Mapbox Configuration (REQUIRED)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_token_here

# Optional Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Performance Requirements

The application must meet these constitutional requirements:

- ✅ Map tile loading: < 2 seconds
- ✅ Animation frame rate: 60fps
- ✅ Memory usage: < 100MB per map instance
- ✅ First Contentful Paint (FCP): < 1.5s
- ✅ Time to Interactive (TTI): < 3.5s

### 3. Build Optimizations

The `next.config.js` file includes:

- **Code Splitting**: Separate bundles for Mapbox GL and Framer Motion
- **Tree Shaking**: Removes unused code automatically
- **Minification**: Using SWC for faster builds
- **Console Removal**: Auto-removes console.log in production
- **Image Optimization**: WebP/AVIF formats with CDN caching

## Build Commands

### Development Build

```bash
npm run dev
```

### Production Build

```bash
# Clean install dependencies
npm ci

# Run production build
npm run build

# Test production build locally
npm start
```

### Build Analysis

```bash
# Analyze bundle size
npm run build -- --profile
```

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Native Next.js support
- Automatic SSL/CDN
- Edge Functions for optimal performance
- Zero configuration deployment

**Deployment Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Navigate to project settings in Vercel dashboard
   - Add `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
   - Redeploy if needed

4. **Custom Domain (Optional)**
   ```bash
   vercel domains add yourdomain.com
   ```

**vercel.json Configuration:**
- Security headers configured
- CSP policy allows Mapbox domains
- Static assets cached for 1 year

### Option 2: Netlify

**Deployment Steps:**

1. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Environment Variables:**
   - Set in Netlify dashboard under Site Settings > Environment Variables

### Option 3: Self-Hosted (Docker)

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Docker Compose:**

```yaml
version: '3.8'

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=${MAPBOX_TOKEN}
    restart: unless-stopped
```

**Deploy:**

```bash
docker-compose up -d
```

## Performance Monitoring

### 1. Web Vitals

Monitor these Core Web Vitals in production:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 2. Lighthouse CI

Add to your CI/CD pipeline:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli@0.12.x autorun
```

### 3. Error Tracking

Configure Sentry for production error tracking:

```bash
npm install --save @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

## Security Headers

The application includes these security headers (configured in `next.config.js`):

- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features
- **Content-Security-Policy**: Configured in vercel.json for Mapbox

## CDN and Caching Strategy

### Static Assets

```javascript
// Cache-Control headers
- Static files: 1 year (immutable)
- Images: 1 year with revalidation
- API routes: No caching
- HTML pages: Stale-while-revalidate
```

### Map Tiles

Mapbox tiles are cached automatically:
- Browser cache: 7 days
- CDN cache: 30 days

## Rollback Strategy

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### Netlify

```bash
# Rollback to previous deployment
netlify rollback
```

### Docker

```bash
# Tag and rollback
docker tag portfolio:latest portfolio:rollback
docker-compose up -d
```

## Health Checks

### Endpoint Monitoring

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

## Continuous Deployment

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: ${{ secrets.MAPBOX_TOKEN }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Post-Deployment Verification

### 1. Smoke Tests

```bash
# Check if site is live
curl -I https://your-domain.com

# Verify Mapbox loads
curl https://your-domain.com | grep "mapbox"
```

### 2. E2E Tests

```bash
# Run Playwright tests against production
PLAYWRIGHT_BASE_URL=https://your-domain.com npm run test:e2e
```

### 3. Performance Audit

```bash
# Run Lighthouse
lighthouse https://your-domain.com --view
```

## Troubleshooting

### Build Failures

1. **Out of Memory**
   ```bash
   # Increase Node memory
   NODE_OPTIONS=--max_old_space_size=4096 npm run build
   ```

2. **Missing Dependencies**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

### Runtime Issues

1. **Map Not Loading**
   - Check MAPBOX_ACCESS_TOKEN is set
   - Verify CSP allows Mapbox domains
   - Check browser console for errors

2. **Performance Issues**
   - Enable bundle analyzer
   - Check for memory leaks
   - Verify CDN is serving static assets

## Constitutional Compliance Verification

Before deploying, verify:

- ✅ TypeScript strict mode enabled
- ✅ ESLint passes with no errors
- ✅ All tests pass (unit, integration, e2e)
- ✅ Code coverage > 80%
- ✅ Performance benchmarks met
- ✅ Accessibility standards met (WCAG 2.1 AA)
- ✅ Mobile responsiveness tested
- ✅ Error handling implemented

## Maintenance

### Regular Tasks

- **Weekly**: Review error logs
- **Monthly**: Update dependencies
- **Quarterly**: Performance audit
- **Annually**: Security audit

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update with caution
npm update

# Major version updates
npx npm-check-updates -u
npm install
```

## Support and Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js/
- **Vercel Docs**: https://vercel.com/docs
- **Deployment Issues**: Check GitHub repository issues

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0
**Constitutional Requirements**: All Met ✅
