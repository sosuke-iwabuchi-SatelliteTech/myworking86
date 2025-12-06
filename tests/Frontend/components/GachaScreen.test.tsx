import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock success response
    vi.mocked(axios.post).mockResolvedValue({
      data: { status: 'success' }
    });

    // Mock a predictable gacha result
    vi.mocked(gachaData.pullGacha).mockReturnValue({
      id: 'ur-a-1',
      name: 'Dragon',
      rarity: 'UR',
      description: 'A powerful dragon',
      imageUrl: '/test-dragon.png'
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

    // Wait for axios to be called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    // Verify API call details
    expect(axios.post).toHaveBeenCalledWith('/api/user/prizes', expect.objectContaining({
      prize_id: 'ur-a-1',
      rarity: 'UR',
    }));
  });
});
