import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PrizeList from '../../../resources/js/pages/PrizeList';
import React from 'react';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock AppLayout since it might have complex dependencies (Sidebar, etc)
vi.mock('@/layouts/app-layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="app-layout">{children}</div>,
}));

// Mock Head
vi.mock('@inertiajs/react', () => ({
    Head: ({ title }: { title: string }) => <div data-testid="head">{title}</div>,
    router: { visit: vi.fn() },
}));

describe('PrizeList Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('displays loading state initially', () => {
        vi.mocked(axios.get).mockImplementation(() => new Promise(() => { })); // Never resolves
        render(<PrizeList />);
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

        render(<PrizeList />);

        // Wait for the dragon to appear
        await waitFor(() => {
            expect(screen.getByText('ドラゴン')).toBeDefined();
        });

        expect(screen.queryByText('Loading...')).toBeNull();
        expect(screen.getByText('1コ')).toBeDefined();

        // Check for "Lion" (sr-a-1)
        expect(screen.getByText('ライオン')).toBeDefined();
        expect(screen.getByText('2コ')).toBeDefined();
    });

    it('displays empty message when no prizes', async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: []
        });

        render(<PrizeList />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });

        expect(screen.getByText("ガチャしてみてね！")).toBeDefined();
    });
});
