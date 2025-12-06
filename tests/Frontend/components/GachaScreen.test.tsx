import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GachaScreen from '../../../resources/js/components/GachaScreen';
import * as gachaData from '../../../resources/js/gachaData';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock gachaData
vi.mock('../../../resources/js/gachaData', async (importOriginal) => {
  const actual = await importOriginal<typeof gachaData>();
  return {
    ...actual,
    pullGacha: vi.fn(),
  };
});

describe('GachaScreen', () => {
  const mockOnBack = vi.fn();
  let imageLoadResolver: (() => void) | null = null;
  let imageErrorResolver: (() => void) | null = null;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();

    // Mock axios post to resolve
    vi.mocked(axios.post).mockResolvedValue({ data: { status: 'success' } });

    // Mock axios get (for points) to resolve
    vi.mocked(axios.get).mockResolvedValue({ data: { points: 1000 } });
    // Reset resolvers
    imageLoadResolver = null;
    imageErrorResolver = null;

    // Mock Image
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Image = class {
      set onload(callback: () => void) {
        imageLoadResolver = callback;
      }
      set onerror(callback: () => void) {
        imageErrorResolver = callback;
      }
      set src(_: string) { }
    };

    // Mock a predictable gacha result
    vi.mocked(gachaData.pullGacha).mockReturnValue({
      id: 'ur-a-1',
      name: 'Dragon',
      rarity: 'UR',
      description: 'A powerful dragon',
      imageUrl: '/test-dragon.png'
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts animation immediately without waiting for API', async () => {
    render(<GachaScreen onBack={mockOnBack} />);

    const pullButton = screen.getByText('ガチャをまわす');
    fireEvent.click(pullButton);

    // Verify axios called
    expect(axios.post).toHaveBeenCalledWith('/api/user/prizes', expect.objectContaining({
      prize_id: 'ur-a-1',
      rarity: 'UR'
    }));

    // Status should be 'dropping' immediately (checking text change for button)
    expect(screen.getByText('......')).toBeTruthy();
  });

  it('waits for both timer and image load during shaking phase', async () => {
    render(<GachaScreen onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('ガチャをまわす'));

    // Advance 1s (Dropping -> Shaking)
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Now in Shaking phase.
    // Advance 3s (Minimum shaking time)
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Should NOT have moved to opening yet because image is not loaded
    await act(async () => {
      vi.advanceTimersByTime(100); // Advance a bit more to be sure
    });

    // Should NOT be result yet
    expect(screen.queryByText('Dragon')).toBeNull();

    // Now trigger image load
    await act(async () => {
      if (imageLoadResolver) imageLoadResolver();
    });

    // It should now transition to Opening. Effect runs. Timer (800ms) starts.

    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    // Now result should be visible
    expect(screen.getByText('Dragon')).toBeTruthy();
  });

  it('handles image load failure gracefully', async () => {
    render(<GachaScreen onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('ガチャをまわす'));

    // Drop -> Shake
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Shake wait (3s)
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Still stuck because image promise pending
    expect(screen.queryByText('Dragon')).toBeNull();

    // Trigger error
    await act(async () => {
      if (imageErrorResolver) imageErrorResolver();
    });

    // Should proceed to opening. Wait for opening animation (800ms)
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    expect(screen.getByText('Dragon')).toBeTruthy();
  });

  it('does not wait for image load if image url is not valid (no slash)', async () => {
    // Mock result with no slash URL
    vi.mocked(gachaData.pullGacha).mockReturnValue({
      id: 'c-1',
      name: 'Emoji Prize',
      rarity: 'C',
      description: 'Desc',
      imageUrl: '🎁'
    });

    render(<GachaScreen onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('ガチャをまわす'));

    // Drop -> Shake
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Shake -> Opening (Image promise is already resolved)
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Opening -> Result
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    // Should be visible
    expect(screen.getByText('Emoji Prize')).toBeTruthy();
  });

  it('supports absolute image URLs (http/https)', async () => {
    // Mock result with absolute URL
    vi.mocked(gachaData.pullGacha).mockReturnValue({
      id: 'ur-cloud',
      name: 'Cloud Dragon',
      rarity: 'UR',
      description: 'Lives in the cloud',
      imageUrl: 'https://example.com/dragon.png'
    });

    render(<GachaScreen onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('ガチャをまわす'));

    // Drop -> Shake
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Shake wait (3s)
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Manually resolve image load since we can't easily trigger the real Image onload for external URL in jsdom without more setup,
    // but the component logic creates the promise.
    // In our mock, Image.onload sets the resolver.
    await act(async () => {
      if (imageLoadResolver) imageLoadResolver();
    });

    // Opening -> Result
    await act(async () => {
      vi.advanceTimersByTime(800);
    });

    // Verify img tag is present with correct src
    const img = screen.getByAltText('Cloud Dragon') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toBe('https://example.com/dragon.png');
  });
});
