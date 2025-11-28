import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnswerChoices from '../../../src/components/quiz/AnswerChoices';

describe('AnswerChoices', () => {
    const mockProps = {
        options: [1, 2, 3, 4],
        selectedAnswer: null,
        correctAnswer: 2,
        feedback: { show: false, isCorrect: false },
        isAnswering: false,
        onAnswer: vi.fn(),
    };

    it('renders all options', () => {
        render(<AnswerChoices {...mockProps} />);
        mockProps.options.forEach(opt => {
            expect(screen.getByText(opt.toString())).toBeDefined();
        });
    });

    it('calls onAnswer when clicked', () => {
        render(<AnswerChoices {...mockProps} />);
        fireEvent.click(screen.getByText('1'));
        expect(mockProps.onAnswer).toHaveBeenCalledWith(1);
    });

    it('disables buttons when answering', () => {
        render(<AnswerChoices {...mockProps} isAnswering={true} />);
        const btn = screen.getByText('1') as HTMLButtonElement;
        expect(btn.disabled).toBe(true);
    });
});
