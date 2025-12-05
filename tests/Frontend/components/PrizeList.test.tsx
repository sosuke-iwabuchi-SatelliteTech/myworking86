
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PrizeList from '../../../resources/js/pages/PrizeList';
import React from 'react';

// Mock AppLayout since it might have complex dependencies (Sidebar, etc)
vi.mock('@/layouts/app-layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="app-layout">{children}</div>,
}));

// Mock Head
vi.mock('@inertiajs/react', () => ({
    Head: ({ title }: { title: string }) => <div data-testid="head">{title}</div>,
}));

// Mock fetch
global.fetch = vi.fn();

describe('PrizeList Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('displays loading state initially', () => {
        (global.fetch as any).mockImplementation(() => new Promise(() => { })); // Never resolves
        render(<PrizeList />);
        expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('displays prizes when fetch succeeds', async () => {
        const mockPrizes = [
            { prize_id: 'ur-a-1', rarity: 'UR', count: 1 },
            { prize_id: 'sr-a-1', rarity: 'SR', count: 2 },
        ];

        (global.fetch as any).mockResolvedValue({
            json: async () => mockPrizes,
        });

        render(<PrizeList />);

        // Wait for the dragon to appear
        await waitFor(() => {
            expect(screen.getByText('ドラゴン')).toBeDefined();
        });

        expect(screen.queryByText('Loading...')).toBeNull();
        expect(screen.getByText('Owned: 1')).toBeDefined();

        // Check for "Lion" (sr-a-1)
        expect(screen.getByText('ライオン')).toBeDefined();
        expect(screen.getByText('Owned: 2')).toBeDefined();
    });

    it('displays empty message when no prizes', async () => {
        (global.fetch as any).mockResolvedValue({
            json: async () => [],
        });

        render(<PrizeList />);

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });

        expect(screen.getByText("You haven't collected any prizes yet. Go play Gacha!")).toBeDefined();
    });
});
