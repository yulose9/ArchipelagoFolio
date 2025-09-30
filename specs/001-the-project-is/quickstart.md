# Quickstart: Interactive 3D Map Portfolio Web App

## Prerequisites

- Node.js 18+ installed
- Mapbox account and access token
- Basic understanding of React/Next.js

## Quick Setup

### 1. Project Initialization

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest portfolio-map-app --typescript --tailwind --eslint --app

# Navigate to project directory
cd portfolio-map-app

# Install required dependencies
npm install mapbox-gl framer-motion gsap @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react

# Install development dependencies
npm install -D @types/mapbox-gl jest @testing-library/react playwright
```

### 2. Environment Configuration

```bash
# Create .env.local file
echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here" > .env.local
```

### 3. Basic File Structure Setup

```bash
# Create directory structure
mkdir -p src/{components/{ui,sections,map,layout},lib/{mapbox,animations,utils},hooks,types,data,styles}
mkdir -p tests/{components,integration,e2e}
mkdir -p public/{images,icons}
```

## Essential Files

### 4. Mapbox Configuration (`src/lib/mapbox/config.ts`)

```typescript
export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: [121.0583, 14.5995] as [number, number], // Philippines center
  zoom: 6,
  pitch: 45,
  bearing: 0,
};

export const PHILIPPINES_BOUNDS: [[number, number], [number, number]] = [
  [116.0, 4.0], // Southwest coordinates
  [127.0, 21.0], // Northeast coordinates
];
```

### 5. Main Portfolio Page (`app/page.tsx`)

```typescript
"use client";

import { useEffect, useRef } from "react";
import MapboxMap from "@/components/map/MapboxMap";
import PortfolioSections from "@/components/sections/PortfolioSections";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* 3D Map Background */}
      <div className="fixed inset-0 z-0">
        <MapboxMap />
      </div>

      {/* Portfolio Content Overlay */}
      <div className="relative z-10">
        <PortfolioSections />
      </div>
    </main>
  );
}
```

### 6. Mock Data (`src/data/portfolio.ts`)

```typescript
export const portfolioSections = [
  {
    id: "about",
    title: "About Me",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    mapRegion: {
      name: "Manila Bay",
      center: [120.9842, 14.5995] as [number, number],
      zoom: 11,
      bearing: 0,
      pitch: 45,
    },
    order: 1,
  },
  // Add more sections...
];
```

## Validation Steps

### 7. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to verify:

- ✅ Page loads without errors
- ✅ Map displays Philippines
- ✅ Basic layout structure is visible

### 8. Test Mapbox Integration

Verify in browser console:

- ✅ No Mapbox token errors
- ✅ Map tiles load successfully
- ✅ Map is interactive (pan/zoom works)

### 9. Performance Check

Open browser DevTools > Performance:

- ✅ Initial page load < 3 seconds
- ✅ Map rendering maintains 60fps
- ✅ No memory leaks during interactions

## Next Steps

### Development Workflow

1. **Components**: Build map and section components
2. **Animations**: Implement scroll-triggered animations
3. **Content**: Add portfolio sections with mock data
4. **Styling**: Apply Tailwind CSS and shadcn/ui components
5. **Testing**: Write component and integration tests

### Deployment Preparation

1. **Build Optimization**: Configure Next.js for production
2. **Performance**: Implement lazy loading and code splitting
3. **Environment**: Set up Vercel/Netlify deployment
4. **Monitoring**: Add performance tracking

## Troubleshooting

### Common Issues

- **Mapbox not loading**: Check access token in .env.local
- **Build errors**: Ensure all TypeScript types are properly defined
- **Performance issues**: Monitor network requests and asset sizes
- **Mobile responsiveness**: Test on various device sizes

### Success Criteria

- [ ] Map loads and displays Philippines correctly
- [ ] Portfolio sections are structured and accessible
- [ ] Basic animations work smoothly
- [ ] Application is mobile responsive
- [ ] Performance meets constitutional requirements (60fps, <2s loading)
