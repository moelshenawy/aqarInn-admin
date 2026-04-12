import '@testing-library/jest-dom/vitest'

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver
}

if (typeof globalThis !== 'undefined' && !globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserver
}
