# 🚀 Interactive 3D Portfolio

A modern, performance-optimized portfolio website featuring an interactive 3D map of the Philippines as the background, built with Next.js, TypeScript, and Mapbox GL.

## ✨ Features

- **Interactive 3D Map**: Stunning 3D visualization of the Philippines using Mapbox GL
- **Smooth Animations**: 60fps scroll-triggered animations with Framer Motion and GSAP
- **Constitutional Development**: Built following strict code quality and performance principles
- **Responsive Design**: Mobile-first design that works on all devices
- **Performance Optimized**: <2s load times, 60fps animations, optimized bundle splitting
- **Accessibility First**: WCAG 2.1 AA compliant with comprehensive testing
- **TypeScript Strict**: Full type safety with strict mode enabled
- **Modern Stack**: Next.js 14+, App Router, Tailwind CSS, shadcn/ui

## 🏗️ Architecture

### Constitutional Principles

This project follows four core constitutional principles:

1. **Code Quality**: TypeScript strict mode, ESLint, Prettier, max 15 lines per function
2. **Testing Standards**: TDD approach, 80% coverage, comprehensive test suites
3. **User Experience**: 60fps animations, <2s loading, mobile-responsive design
4. **Performance**: Memory usage <100MB, optimized bundling, Core Web Vitals compliance

### Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: Mapbox GL JS for 3D visualization
- **Animation**: Framer Motion + GSAP for smooth interactions
- **Testing**: Jest, React Testing Library, Playwright E2E
- **Deployment**: Vercel with performance monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Mapbox access token ([Get one here](https://account.mapbox.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd interactive-3d-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Add your Mapbox access token:

   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. **Development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main portfolio page
│   └── globals.css        # Global styles
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── sections/     # Portfolio sections
│   │   ├── map/          # Mapbox components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── animations/   # Animation utilities
│   │   ├── mapbox/       # Mapbox helpers
│   │   └── utils/        # General utilities
│   ├── types/            # TypeScript definitions
│   └── data/             # Mock data
├── tests/                # Test suites
│   ├── __tests__/        # Unit tests
│   ├── e2e/              # Playwright E2E tests
│   └── setup.ts          # Test configuration
├── specs/                # Project specifications
└── .specify/             # Constitutional documents
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### E2E Tests

```bash
npm run test:e2e
npm run test:e2e:ui     # Interactive UI mode
```

### Performance Testing

```bash
npm run test:performance
```

### Accessibility Testing

```bash
npm run test:accessibility
```

## 📊 Performance Monitoring

The application includes comprehensive performance monitoring:

- **Core Web Vitals**: LCP, FID, CLS tracking
- **FPS Monitoring**: Real-time frame rate monitoring
- **Memory Usage**: JavaScript heap size tracking
- **Load Time Analysis**: Complete loading performance metrics

Performance reports are logged in development mode and can be monitored in production.

## ♿ Accessibility

Built with accessibility as a first-class citizen:

- **WCAG 2.1 AA Compliance**: Comprehensive accessibility testing
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: AA-level contrast ratios throughout
- **Focus Management**: Visible focus indicators and proper tab order

## 🎨 Customization

### Animations

- **Framer Motion variants**: Located in `src/lib/animations/motionVariants.ts`
- **GSAP utilities**: Advanced animations in `src/lib/animations/gsapUtils.ts`
- **Custom hooks**: Animation logic in `src/hooks/`

### Map Configuration

- **Map settings**: Configure in `src/components/map/MapboxMap.tsx`
- **Philippines regions**: Defined in `src/data/mockData.ts`
- **Camera animations**: Managed by `src/hooks/useMapAnimation.ts`

### Content

- **Portfolio sections**: Mock data in `src/data/mockData.ts`
- **Section components**: Individual sections in `src/components/sections/`
- **Metadata**: SEO and meta tags in `app/layout.tsx`

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
npm run start           # Test production build locally
vercel deploy           # Deploy to Vercel
```

### Other Platforms

```bash
npm run build
npm run export          # Static export (if needed)
```

The application is optimized for deployment on Vercel with:

- Automatic performance monitoring
- Edge function optimization
- Image optimization
- CDN caching strategies

## 📈 Performance Budgets

The application maintains strict performance budgets:

- **Load Time**: < 2 seconds
- **FPS**: Minimum 60fps during animations
- **Memory Usage**: < 100MB per map instance
- **Bundle Size**: Optimized chunk splitting
- **Core Web Vitals**: Green scores across all metrics

## 🔧 Development Tools

- **TypeScript**: Strict mode enabled
- **ESLint**: Custom rules for map development
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality gates
- **Commitlint**: Conventional commit messages

## 📚 Documentation

- **Constitutional Principles**: `.specify/memory/constitution.md`
- **Feature Specifications**: `specs/001-the-project-is/spec.md`
- **Implementation Tasks**: `specs/001-the-project-is/tasks.md`
- **API Documentation**: Auto-generated TypeScript docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the constitutional principles
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mapbox GL JS**: 3D mapping capabilities
- **Framer Motion**: Smooth animations
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Beautiful component library

---

Built with ❤️ following constitutional development principles for optimal performance, accessibility, and user experience.
