import '@testing-library/jest-dom';

// Mock global fetch
global.fetch = jest.fn();

// Mock Mapbox GL JS
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    flyTo: jest.fn(),
    getContainer: jest.fn(() => document.createElement('div')),
  })),
  NavigationControl: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    h1: 'h1',
    p: 'p',
  },
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
}));