import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CalculationPad from '../../src/components/CalculationPad';

describe('CalculationPad', () => {
  const mockProps = {
    num1: 12,
    num2: 3,
    onSubmit: vi.fn(),
    onNextQuestion: vi.fn(),
    isCorrectionMode: false,
    correctAnswer: 36
  };

  it('renders keypad and submit button', () => {
    render(<CalculationPad {...mockProps} />);
    expect(screen.getByRole('button', { name: 'こたえる' })).toBeDefined();
    ['0','1','2','3','4','5','6','7','8','9'].forEach(n => {
        // Just ensure buttons exist
        expect(screen.getByRole('button', { name: n })).toBeDefined();
    });
  });

  it('inputs numbers into cells', () => {
    render(<CalculationPad {...mockProps} />);

    // Initial active cell is row 0, col 3
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(screen.getByTestId('cell-0-3').textContent).toBe('1');

    // Cursor advances
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByTestId('cell-0-2').textContent).toBe('2');
  });

  it('submits the answer from the last row', () => {
    render(<CalculationPad {...mockProps} />);

    // Fill answer row (row 2)
    fireEvent.click(screen.getByTestId('cell-2-3'));
    fireEvent.click(screen.getByRole('button', { name: '6' }));

    fireEvent.click(screen.getByTestId('cell-2-2'));
    fireEvent.click(screen.getByRole('button', { name: '3' }));

    fireEvent.click(screen.getByTestId('submit-button'));
    expect(mockProps.onSubmit).toHaveBeenCalledWith(36);
  });

  it('handles backspace', () => {
     render(<CalculationPad {...mockProps} />);

     fireEvent.click(screen.getByRole('button', { name: '1' }));
     expect(screen.getByTestId('cell-0-3').textContent).toBe('1');

     fireEvent.click(screen.getByRole('button', { name: 'もどる' }));
     expect(screen.getByTestId('cell-0-3').textContent).toBe('');
  });

  it('shows correction mode state and validates correctness', () => {
    // Initial render in correction mode
    render(<CalculationPad {...mockProps} isCorrectionMode={true} />);

    expect(screen.getByRole('button', { name: '次の問題へ' })).toBeDefined();
    const btn = screen.getByTestId('submit-button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);

    // Fill correct answer
    fireEvent.click(screen.getByTestId('cell-2-2'));
    fireEvent.click(screen.getByRole('button', { name: '3' }));

    fireEvent.click(screen.getByTestId('cell-2-3'));
    fireEvent.click(screen.getByRole('button', { name: '6' }));

    // Button should become enabled
    expect(btn.disabled).toBe(false);

    fireEvent.click(btn);
    expect(mockProps.onNextQuestion).toHaveBeenCalled();
  });
});
