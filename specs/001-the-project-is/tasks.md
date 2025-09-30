# Tasks: Interactive 3D Map Portfolio Web App

**Input**: Design documents from `/workspaces/test2/specs/001-the-project-is/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → Tech stack: Next.js 14+, TypeScript, Mapbox GL JS, Framer Motion, GSAP, Tailwind CSS, shadcn/ui
   → Structure: Single web application with src/ and tests/ directories
2. Load design documents:
   → data-model.md: Section, MapRegion, UIComponent entities
   → contracts/: sections-api, map-regions-api, animation-events-api
   → research.md: Performance patterns, error handling strategies
   → quickstart.md: Integration test scenarios
3. Generate tasks by category:
   → Setup: Next.js project, dependencies, TypeScript config, linting
   → Tests: API contract tests, component tests, integration tests
   → Core: TypeScript types, React components, map integration
   → Integration: Animation systems, scroll handling, performance optimization
   → Polish: E2E tests, performance benchmarks, deployment
4. Apply task rules:
   → Different components = mark [P] for parallel
   → Shared files/dependencies = sequential
   → Tests before implementation (TDD)
5. Generate 38 numbered tasks (T001-T038)
6. Focus on constitutional requirements: 60fps performance, <2s loading, mobile responsive
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup

- [x] T001 Create Next.js project structure with TypeScript and Tailwind CSS
- [x] T002 Install core dependencies: mapbox-gl, framer-motion, gsap, shadcn/ui components
- [x] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T004 [P] Configure ESLint and Prettier rules for React and map development
- [x] T005 [P] Setup environment variables for Mapbox access token in .env.local
- [x] T006 Create project directory structure in src/{components,lib,hooks,types,data,styles}

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T007 [P] Contract test GET /api/sections in tests/components/sections-api.test.ts
- [x] T008 [P] Contract test GET /api/map/regions in tests/components/map-regions-api.test.ts
- [x] T009 [P] Contract test POST /api/animations/track in tests/components/animation-events-api.test.ts
- [x] T010 [P] Integration test scroll-triggered map animations in tests/integration/scroll-map-animations.test.ts
- [x] T011 [P] Integration test section visibility and transitions in tests/integration/section-transitions.test.ts
- [x] T012 [P] Integration test mobile responsive map interactions in tests/integration/mobile-interactions.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T013 [P] Section type definitions in src/types/Section.ts
- [x] T014 [P] MapRegion type definitions in src/types/MapRegion.ts
- [x] T015 [P] UIComponent type definitions in src/types/UIComponent.ts
- [x] T016 [P] AnimationConfig type definitions in src/types/AnimationConfig.ts
- [x] T017 [P] Mock portfolio data in src/data/portfolio.ts
- [x] T018 [P] Mock map regions data in src/data/mapRegions.ts
- [x] T019 Mapbox configuration and utilities in src/lib/mapbox/config.ts
- [x] T020 Mapbox map component with 3D Philippines view in src/components/map/MapboxMap.tsx
- [x] T021 [P] About Me section component in src/components/sections/AboutSection.tsx
- [x] T022 [P] Projects section component in src/components/sections/ProjectsSection.tsx
- [x] T023 [P] Skills section component in src/components/sections/SkillsSection.tsx
- [x] T024 [P] Contact section component in src/components/sections/ContactSection.tsx
- [x] T025 Portfolio sections container component in src/components/sections/PortfolioSections.tsx

## Phase 3.4: Integration

- [x] T026 Scroll progress hook using Framer Motion in src/hooks/useScrollProgress.ts
- [x] T027 Map animation hook for scroll-triggered camera movements in src/hooks/useMapAnimation.ts
- [x] T028 Section visibility hook using Intersection Observer in src/hooks/useSectionVisibility.ts
- [x] T029 Animation utilities with GSAP timelines in src/lib/animations/gsapUtils.ts
- [x] T030 Framer Motion animation variants in src/lib/animations/motionVariants.ts
- [x] T031 Main portfolio page with map background in app/page.tsx
- [x] T032 Root layout with global styles in app/layout.tsx
- [x] T033 Error boundary for Mapbox failures in src/components/layout/ErrorBoundary.tsx

## Phase 3.5: Polish

- [x] T034 [P] E2E test suite with Playwright in tests/e2e/portfolio.spec.ts
- [x] T035 [P] Performance benchmarks for map loading and animations in tests/performance/performance.test.ts
- [x] T036 [P] Mobile responsiveness tests across device sizes in tests/integration/responsive.test.ts
- [x] T037 [P] Accessibility tests for keyboard navigation and screen readers in tests/integration/accessibility.test.ts
- [x] T038 Production build optimization and deployment configuration

## Dependencies

- Setup (T001-T006) before everything
- Contract tests (T007-T012) before implementation (T013-T033)
- Type definitions (T013-T016) before components that use them
- Mock data (T017-T018) before components that consume data
- Mapbox config (T019) before map component (T020)
- Individual section components (T021-T024) before container (T025)
- Core components (T020, T025) before integration features (T026-T033)
- All implementation before polish phase (T034-T038)

## Parallel Example

```bash
# Launch contract tests together (Phase 3.2):
Task: "Contract test GET /api/sections in tests/components/sections-api.test.ts"
Task: "Contract test GET /api/map/regions in tests/components/map-regions-api.test.ts"
Task: "Contract test POST /api/animations/track in tests/components/animation-events-api.test.ts"

# Launch type definitions together (Phase 3.3):
Task: "Section type definitions in src/types/Section.ts"
Task: "MapRegion type definitions in src/types/MapRegion.ts"
Task: "UIComponent type definitions in src/types/UIComponent.ts"

# Launch section components together (Phase 3.3):
Task: "About Me section component in src/components/sections/AboutSection.tsx"
Task: "Projects section component in src/components/sections/ProjectsSection.tsx"
Task: "Skills section component in src/components/sections/SkillsSection.tsx"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify contract tests fail before implementing
- Maintain 60fps animations per constitutional requirements
- Ensure <2s map tile loading performance
- Test mobile responsiveness throughout development
- Commit after each completed task

## Constitutional Compliance Checklist

- [x] TypeScript strict mode enabled (T003)
- [x] ESLint/Prettier configured (T004)
- [x] TDD approach followed (Tests T007-T012 before implementation)
- [x] 80% code coverage achieved via comprehensive testing
- [x] Mobile responsiveness implemented and tested (T036)
- [x] Performance requirements verified (T035): 60fps animations, <2s loading
- [x] Error handling implemented (T033)
- [x] Accessibility standards met (T037)
