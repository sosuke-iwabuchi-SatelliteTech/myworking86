import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GachaScreen from '../../../resources/js/components/GachaScreen';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('GachaScreen', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock axios get (for status)
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        points: 1000,
        isFreeAvailable: true,
        cost: 300
      }
    });

    // Mock axios post (for pull)
    vi.mocked(axios.post).mockResolvedValue({
      data: {
        result: {
          id: 'ur-a-1',
          name: 'Dragon',
          rarity: 'UR',
          description: 'A powerful dragon',
          imageUrl: '/test-dragon.png'
        },
        points: 700,
        isFreeAvailable: false
      }
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches status on mount and displays correct button', async () => {
    render(<GachaScreen onBack={mockOnBack} />);

    expect(axios.get).toHaveBeenCalledWith('/api/gacha/status');
    expect(await screen.findByText('無料ガチャ')).toBeTruthy();
  });

  it('displays cost if not free', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { points: 1000, isFreeAvailable: false, cost: 300 }
    });

    render(<GachaScreen onBack={mockOnBack} />);

    expect(await screen.findByText('300ptガチャ')).toBeTruthy();
  });

  it('starts animation after successful API call', async () => {
    render(<GachaScreen onBack={mockOnBack} />);

    const pullButton = await screen.findByText('無料ガチャ');

    fireEvent.click(pullButton);

    expect(axios.post).toHaveBeenCalledWith('/api/gacha/pull');
    expect(await screen.findByText('......')).toBeTruthy();
  });
  it('displays hyphen and disables button while loading points', async () => {
    // Delay resolution to check loading state
    vi.mocked(axios.get).mockImplementation(() => new Promise(() => { }));

    render(<GachaScreen onBack={mockOnBack} />);

    expect(screen.getByText('-')).toBeTruthy();

    // Check if pull button is disabled
    const pullButton = screen.getByRole('button', { name: /ptガチャ|無料ガチャ/ });
    expect(pullButton.hasAttribute('disabled')).toBe(true);
  });
});
