import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GachaScreen from '../../src/components/GachaScreen';

// Mock gachaData to control results
vi.mock('../../src/gachaData', () => ({
  pullGacha: vi.fn(),
}));

import { pullGacha } from '../../src/gachaData';

describe('GachaScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders idle state initially', () => {
    render(<GachaScreen onBack={() => {}} />);
    expect(screen.getByText('ボタンをおしてガチャをまわそう！')).toBeDefined();
    expect(screen.getByRole('button', { name: 'ガチャをまわす' })).toBeDefined();
  });

  it('starts animation sequence on button click', async () => {
    const mockItem = {
      id: 'c-1',
      name: 'Common Item',
      rarity: 'C',
      description: 'Test description',
      imageUrl: '/gacha/test.svg'
    };
    (pullGacha as Mock).mockReturnValue(mockItem);

    render(<GachaScreen onBack={() => {}} />);
    
    // Click button
    const button = screen.getByRole('button', { name: 'ガチャをまわす' });
    fireEvent.click(button);

    // Should change to '......'
    expect(screen.getByRole('button', { name: '......' })).toBeDefined();
    
    // Fast forward drop (1s)
    await act(async () => {
        vi.advanceTimersByTime(1100);
    });

    // Fast forward shake (3s)
    await act(async () => {
        vi.advanceTimersByTime(3100);
    });

    // Fast forward open (0.8s)
    await act(async () => {
        vi.advanceTimersByTime(900);
    });

    // Should show result
    expect(screen.getByText('Common Item')).toBeDefined();
    expect(screen.getByText('Test description')).toBeDefined();
    expect(screen.getByRole('button', { name: 'もういちど' })).toBeDefined();
  });

  it('resets to idle state when clicking reset', async () => {
    const mockItem = {
        id: 'c-1',
        name: 'Common Item',
        rarity: 'C',
        description: 'Test description',
        imageUrl: '/gacha/test.svg'
      };
    (pullGacha as Mock).mockReturnValue(mockItem);

    render(<GachaScreen onBack={() => {}} />);
    
    // Start sequence
    fireEvent.click(screen.getByRole('button', { name: 'ガチャをまわす' }));
    
    // Advance through all states incrementally to ensure effects trigger
    await act(async () => {
        vi.advanceTimersByTime(1100); // Drop -> Shake
    });
    await act(async () => {
        vi.advanceTimersByTime(3100); // Shake -> Open
    });
    await act(async () => {
        vi.advanceTimersByTime(900); // Open -> Result
    });

    // Verify we are at result screen
    expect(screen.getByRole('button', { name: 'もういちど' })).toBeDefined();

    // Click reset
    const resetButton = screen.getByRole('button', { name: 'もういちど' });
    fireEvent.click(resetButton);

    // Should be back to idle
    expect(screen.getByText('ボタンをおしてガチャをまわそう！')).toBeDefined();
  });
});
