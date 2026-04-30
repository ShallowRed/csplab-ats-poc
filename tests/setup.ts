import { beforeAll, afterAll, afterEach } from 'vitest'

// jsdom doesn't implement ResizeObserver; stub it for components using @dnd-kit
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

beforeAll(() => {})
afterEach(() => {})
afterAll(() => {})
