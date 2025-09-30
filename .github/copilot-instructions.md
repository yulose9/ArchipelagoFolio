# GitHub Copilot Instructions for Interactive 3D Map Portfolio

## Project Context

Building a single-page interactive portfolio web application featuring a full-screen 3D map of the Philippines as the background, with smooth animations and modern React architecture.

## Technology Stack

- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Map**: Mapbox GL JS for 3D visualization
- **Animations**: Framer Motion + GSAP for micro-animations
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel/Netlify

## Key Patterns

### Map Integration

```typescript
// Always wrap Mapbox components with dynamic imports for SSR
const MapboxMap = dynamic(() => import("@/components/map/MapboxMap"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-full" />,
});

// Use ref pattern for map instance access
const mapRef = useRef<mapboxgl.Map>();
```

### Animation Patterns

```typescript
// Scroll-triggered animations with Framer Motion
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

// GSAP timeline for complex sequences
const tl = gsap.timeline({ paused: true });
tl.to(".element", { opacity: 1, duration: 0.8, ease: "power2.out" });
```

### Performance Optimizations

- Use `React.memo` for heavy components
- Implement `useMemo` for expensive calculations
- Lazy load sections with `React.lazy`
- Debounce scroll events for 60fps performance

## Constitutional Requirements

### Code Quality (NON-NEGOTIABLE)

- Enable TypeScript strict mode
- Configure ESLint with map-specific rules
- Use Prettier for consistent formatting
- Keep functions under 15 lines, max 3 nesting levels

### Testing Standards (NON-NEGOTIABLE)

- Write tests before implementation (TDD)
- Maintain 80% code coverage
- Test map interactions and coordinate transformations
- Include integration tests for scroll animations

### Performance Requirements

- Map tiles load within 2 seconds
- Maintain 60fps during pan/zoom operations
- Memory usage under 100MB per map instance
- Optimize for mobile devices

## Component Architecture

### Directory Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── sections/        # Portfolio sections
│   ├── map/             # Map components
│   └── layout/          # Layout components
├── lib/
│   ├── mapbox/          # Mapbox utilities
│   ├── animations/      # Animation helpers
│   └── utils/           # General utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── data/                # Mock data
```

### Naming Conventions

- Components: PascalCase (`MapboxMap`, `PortfolioSection`)
- Hooks: camelCase with `use` prefix (`useMapAnimation`)
- Utilities: camelCase (`formatCoordinates`)
- Types: PascalCase (`MapRegion`, `AnimationConfig`)

## Mock Data Guidelines

- Use Lorem Ipsum for all text content
- Generate realistic Philippines coordinates
- Include placeholder images with proper alt text
- Maintain consistent data structure across sections

## Error Handling

- Graceful degradation for Mapbox loading failures
- Fallback static images for map errors
- Progressive enhancement for animations
- User-friendly error messages

## Recent Changes

- Initial project setup with Next.js and TypeScript
- Constitutional principles established for code quality and performance
- Project structure defined for scalable architecture

## Assistance Focus

When providing code suggestions:

1. Follow TypeScript strict mode patterns
2. Implement responsive design with Tailwind CSS
3. Optimize for performance (60fps animations, fast loading)
4. Include error handling and accessibility features
5. Write testable, modular code following constitutional principles
6. Use mock/placeholder data for all content
