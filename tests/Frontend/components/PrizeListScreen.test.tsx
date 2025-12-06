import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import PrizeListScreen from '../../../resources/js/components/PrizeListScreen';
import React from 'react';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('PrizeListScreen Component', () => {
    const mockOnBack = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('displays loading state initially', () => {
        vi.mocked(axios.get).mockImplementation(() => new Promise(() => { })); // Never resolves
        render(<PrizeListScreen onBack={mockOnBack} />);
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('displays prizes when fetch succeeds', async () => {
        const mockPrizes = [
            { prize_id: 'ur-a-1', rarity: 'UR', count: 1 },
            { prize_id: 'sr-a-1', rarity: 'SR', count: 2 },
        ];

        vi.mocked(axios.get).mockResolvedValue({
            data: mockPrizes
        });

        render(<PrizeListScreen onBack={mockOnBack} />);

        // Wait for content (Dragon is UR)
        await waitFor(() => {
            expect(screen.getByText('ドラゴン')).toBeDefined();
        });

        expect(screen.queryByText('Loading...')).toBeNull();
        expect(screen.getByText('1コ')).toBeDefined();

        // Check for "Lion" (SR)
        expect(screen.getByText('ライオン')).toBeDefined();
        expect(screen.getByText('2コ')).toBeDefined();

        // Verify layout
        const prizeItem = screen.getByText('ドラゴン');
        const grid = prizeItem.closest('.grid');
        expect(grid?.className).toContain('grid-cols-2');
        expect(grid?.className).not.toContain('grid-cols-1');
        expect(grid?.className).not.toContain('md:grid-cols-3');
    });

    it('displays empty message when no prizes', async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: []
        });

        render(<PrizeListScreen onBack={mockOnBack} />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });

        expect(screen.getByText("ガチャしてみてね！")).toBeDefined();
    });

    it('calls onBack when back button is clicked', async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: []
        });

        render(<PrizeListScreen onBack={mockOnBack} />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });
});
