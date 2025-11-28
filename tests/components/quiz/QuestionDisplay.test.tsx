import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuestionDisplay from '../../../src/components/quiz/QuestionDisplay';

// Mock GeometryDisplay
vi.mock('../../../src/components/quiz/GeometryDisplay', () => ({
    default: () => <div data-testid="geometry-display">Mock Geometry</div>
}));

describe('QuestionDisplay', () => {
    const mockQuestion = {
        text: 'Test Question',
        correctAnswer: 1,
        options: [1]
    };

    it('renders question text', () => {
        render(<QuestionDisplay question={mockQuestion as any} isAnswering={false} />);
        expect(screen.getByText('Test Question')).toBeDefined();
    });

    it('renders geometry when present', () => {
        const geoQuestion = { ...mockQuestion, geometry: { type: 'rectangle', width: 10, height: 10 } };
        render(<QuestionDisplay question={geoQuestion as any} isAnswering={false} />);
        expect(screen.getByTestId('geometry-display')).toBeDefined();
    });

    it('applies opacity when answering', () => {
        const { container } = render(<QuestionDisplay question={mockQuestion as any} isAnswering={true} />);
        const div = container.querySelector('.opacity-20');
        expect(div).toBeDefined();
    });
});
