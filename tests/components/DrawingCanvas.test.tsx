import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DrawingCanvas from '../../src/components/DrawingCanvas';

// Mock getSettings and saveSettings
vi.mock('../../src/utils/storage', () => ({
  getSettings: vi.fn(() => ({ penSize: 2 })),
  saveSettings: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('DrawingCanvas', () => {
  it('renders correctly', () => {
    render(<DrawingCanvas />);
    expect(screen.getByText('けいさん用紙')).toBeDefined();
    expect(screen.getByRole('button', { name: 'すべて消す' })).toBeDefined();
  });

  it('initializes canvas context on mount', () => {
    const { container } = render(<DrawingCanvas />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });
});
