import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GachaScreen from '../../../resources/js/components/GachaScreen';
import * as gachaData from '../../../resources/js/gachaData';

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
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = mockFetch;
    // Mock success response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' }),
    });

    // Mock a predictable gacha result
    vi.mocked(gachaData.pullGacha).mockReturnValue({
      id: 'ur-a-1',
      name: 'Dragon',
      rarity: 'UR',
      description: 'A powerful dragon',
      imageUrl: '/test-dragon.png'
    });

    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'XSRF-TOKEN=test-token',
    });
  });

  it('renders correctly', () => {
    render(<GachaScreen onBack={mockOnBack} />);
    expect(screen.getByText('どうぶつガチャ')).toBeTruthy();
    expect(screen.getByText('ガチャをまわす')).toBeTruthy();
  });

  it('calls API when gacha is pulled', async () => {
    render(<GachaScreen onBack={mockOnBack} />);

    const pullButton = screen.getByText('ガチャをまわす');
    fireEvent.click(pullButton);

    // Wait for fetch to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Verify API call details
    expect(mockFetch).toHaveBeenCalledWith('/api/user/prizes', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': 'test-token',
      }),
      body: JSON.stringify({
        prize_id: 'ur-a-1',
        rarity: 'UR',
      }),
    }));
  });
});
