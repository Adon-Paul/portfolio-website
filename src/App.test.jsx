import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock Three.js/Canvas components since they don't render well in jsdom
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div>Canvas Mock {children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({ viewport: { width: 100, height: 100 } }),
  extend: vi.fn(),
}))

vi.mock('@react-three/drei', () => {
  const useGLTFMock = vi.fn(() => ({
      nodes: {},
      materials: {}
  }));
  useGLTFMock.preload = vi.fn();

  return {
    Text: ({ children }) => <div>{children}</div>,
    Float: ({ children }) => <div>{children}</div>,
    PerspectiveCamera: () => null,
    Environment: () => null,
    ContactShadows: () => null,
    Html: ({ children }) => <div>{children}</div>,
    useGLTF: useGLTFMock,
    useTexture: vi.fn(() => null)
  }
})

vi.mock('@react-three/rapier', () => ({
  Physics: ({ children }) => <div>{children}</div>,
  RigidBody: ({ children }) => <div>{children}</div>,
  CuboidCollider: () => null,
  BallCollider: () => null,
  useRopeJoint: vi.fn(),
  useSphericalJoint: vi.fn()
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Splash screen usually appears first
    expect(screen.getByTitle(/Click to enter/i)).toBeInTheDocument()
  })
})
