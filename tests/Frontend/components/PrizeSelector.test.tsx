import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import PrizeSelector from '../../../resources/js/components/PrizeSelector';

// Mock Prize Data
const mockPrizes = [
    { id: '1', prize: { name: 'Prize A', imageUrl: '', rarity: 'R' } },
    { id: '2', prize: { name: 'Prize B', imageUrl: '', rarity: 'UR' } },
    { id: '3', prize: { name: 'Prize C', imageUrl: '', rarity: 'SR' } },
    { id: '4', prize: { name: 'Prize D', imageUrl: '', rarity: 'C' } },
    { id: '5', prize: { name: 'Prize E', imageUrl: '', rarity: 'UC' } },
];

describe('PrizeSelector Component', () => {
    it('renders rarity filter buttons in correct order (UR -> SR -> R -> UC -> C)', () => {
        render(
            <PrizeSelector
                prizes={mockPrizes}
                selectedIds={[]}
                onToggle={vi.fn()}
            />
        );

        // Get all labels (filter buttons) inside the rarity filter container
        // We know they are labels with text content of the rarity name
        const labels = screen.getAllByText(/^(UR|SR|R|UC|C)$/).filter(el => el.tagName === 'LABEL');

        // Extract text content to verify order
        const rarityOrder = labels.map(label => label.textContent);

        expect(rarityOrder).toEqual(['UR', 'SR', 'R', 'UC', 'C']);
    });
});
