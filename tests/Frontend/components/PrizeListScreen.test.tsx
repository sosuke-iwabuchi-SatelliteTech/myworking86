import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PrizeListScreen from '../../../resources/js/components/PrizeListScreen';
import React from 'react';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// (skip to test case)


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

    it('toggles search panel visibility', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] });
        render(<PrizeListScreen onBack={mockOnBack} />);
        await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

        expect(screen.queryByText('名前で検索')).toBeNull();

        fireEvent.click(screen.getByText('検索する'));
        expect(screen.getByText('名前で検索')).toBeDefined();
        expect(screen.getByText('検索を閉じる')).toBeDefined();

        fireEvent.click(screen.getByText('検索を閉じる'));
        expect(screen.queryByText('名前で検索')).toBeNull();
    });

    it('filters prizes by name', async () => {
        const mockPrizes = [
            { prize_id: 'ur-a-1', rarity: 'UR', count: 1 }, // Dragon
            { prize_id: 'sr-a-1', rarity: 'SR', count: 1 }, // Lion
        ];
        vi.mocked(axios.get).mockResolvedValue({ data: mockPrizes });
        render(<PrizeListScreen onBack={mockOnBack} />);
        await waitFor(() => expect(screen.getByText('ドラゴン')).toBeDefined());

        fireEvent.click(screen.getByText('検索する'));

        const input = screen.getByPlaceholderText('景品の名前を入力...');
        fireEvent.change(input, { target: { value: 'ドラゴン' } });

        fireEvent.click(screen.getByText('検索実行'));

        expect(screen.getByText('ドラゴン')).toBeDefined();
        expect(screen.queryByText('ライオン')).toBeNull();
    });

    it('filters prizes by rarity', async () => {
        const mockPrizes = [
            { prize_id: 'ur-a-1', rarity: 'UR', count: 1 },
            { prize_id: 'sr-a-1', rarity: 'SR', count: 1 },
        ];
        vi.mocked(axios.get).mockResolvedValue({ data: mockPrizes });
        render(<PrizeListScreen onBack={mockOnBack} />);
        await waitFor(() => expect(screen.getByText('ドラゴン')).toBeDefined());

        fireEvent.click(screen.getByText('検索する'));

        // Find checkbox for SR and click it
        // Use within to avoid conflict with prize card badges
        const filterSection = screen.getByText('レア度で絞り込み').closest('div');
        const srLabel = within(filterSection!).getByText('SR');
        fireEvent.click(srLabel);

        fireEvent.click(screen.getByText('検索実行'));

        expect(screen.queryByText('ドラゴン')).toBeNull();
        expect(screen.getByText('ライオン')).toBeDefined();
    });

    it('paginates results', async () => {
        // Create 11 items
        const mockPrizes = Array.from({ length: 11 }, (_, i) => ({
            prize_id: `c-a-${i + 1}`, rarity: 'C', count: 1
        }));
        // c-a-1 is Ant (Ari)

        vi.mocked(axios.get).mockResolvedValue({ data: mockPrizes });
        render(<PrizeListScreen onBack={mockOnBack} />);
        await waitFor(() => expect(screen.queryByText('Loading...')).toBeNull());

        // Assuming default sort or order, we should see 10 items.
        // Let's check for pagination controls
        expect(screen.getByText('1 / 2')).toBeDefined();
        expect(screen.getByText('次へ')).toBeDefined();

        // Check if 11th item is NOT visible (assuming order)
        // Since all are same ID logic in mock might be tricky if we relied on specific names from ID.
        // But here we used 'c-a-i'. The component maps ID to name via GACHA_ITEMS.
        // 'c-a-x' might not validly map to different names if IDs don't exist in GACHA_ITEMS.
        // GachaData.ts likely has c-a-1..5 etc.
        // Let's rely on item count on screen.

        const displayedItems = screen.getAllByText(/コ$/); // Select count badges "1コ"
        expect(displayedItems.length).toBe(10);

        fireEvent.click(screen.getByText('次へ'));

        expect(screen.getByText('2 / 2')).toBeDefined();
        const displayedItemsPage2 = screen.getAllByText(/コ$/);
        expect(displayedItemsPage2.length).toBe(1);

        fireEvent.click(screen.getByText('前へ'));
        expect(screen.getByText('1 / 2')).toBeDefined();
    });
});
