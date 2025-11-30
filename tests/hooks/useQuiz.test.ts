import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useQuiz } from '../../src/hooks/useQuiz';
import { QuestionFactory } from '../../src/questions/QuestionFactory';
import { Level } from '../../src/types';

// Mock QuestionFactory
vi.mock('../../src/questions/QuestionFactory', () => {
  return {
    QuestionFactory: {
      create: vi.fn(),
    },
  };
});

describe('useQuiz Hook', () => {
  const mockOnQuizComplete = vi.fn();
  const mockOnBeforeNextQuestion = vi.fn();
  const mockLevel: Level = {
    id: 'grade-1-calc',
    name: 'Test Level',
    numberOfQuestions: 2,
    answerMode: 'choice',
  };

  const mockQuestion = {
    text: '1 + 1',
    correctAnswer: 2,
    options: [1, 2, 3, 4],
  };

  const mockGenerator = {
    generate: vi.fn().mockReturnValue(mockQuestion),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (QuestionFactory.create as any).mockReturnValue(mockGenerator);
    mockOnQuizComplete.mockClear();
    mockOnBeforeNextQuestion.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // Helper to advance countdown
  const advanceCountdown = () => {
      act(() => { vi.advanceTimersByTime(1000); });
      act(() => { vi.advanceTimersByTime(1000); });
      act(() => { vi.advanceTimersByTime(1000); });
  };

  it('should initialize with countdown and correct default state', () => {
    const { result } = renderHook(() =>
      useQuiz({
        level: mockLevel,
        answerMode: 'choice',
        onQuizComplete: mockOnQuizComplete,
      })
    );

    expect(result.current.countdown).toBe(3);
    expect(result.current.currentQuestionIndex).toBe(1);
    expect(result.current.correctAnswerCount).toBe(0);
    expect(result.current.isAnswering).toBe(false);
  });

  it('should decrement countdown and start quiz', () => {
    const { result } = renderHook(() =>
      useQuiz({
        level: mockLevel,
        answerMode: 'choice',
        onQuizComplete: mockOnQuizComplete,
      })
    );

    // 3 -> 2
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.countdown).toBe(2);

    // 2 -> 1
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.countdown).toBe(1);

    // 1 -> 0
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.countdown).toBe(0);
  });

  it('should handle correct answer (Choice Mode)', () => {
    const { result } = renderHook(() =>
      useQuiz({
        level: mockLevel,
        answerMode: 'choice',
        onQuizComplete: mockOnQuizComplete,
        onBeforeNextQuestion: mockOnBeforeNextQuestion,
      })
    );

    advanceCountdown();

    act(() => {
      result.current.handleAnswer(2); // Correct
    });

    expect(result.current.feedback.show).toBe(true);
    expect(result.current.feedback.isCorrect).toBe(true);
    expect(result.current.correctAnswerCount).toBe(1);
    expect(result.current.selectedAnswer).toBe(2);

    // Wait for delay to next question
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentQuestionIndex).toBe(2);
    expect(mockOnBeforeNextQuestion).toHaveBeenCalled();
    expect(result.current.feedback.show).toBe(false);
  });

  it('should handle incorrect answer (Choice Mode)', () => {
    const { result } = renderHook(() =>
      useQuiz({
        level: mockLevel,
        answerMode: 'choice',
        onQuizComplete: mockOnQuizComplete,
      })
    );

    advanceCountdown();

    act(() => {
      result.current.handleAnswer(99); // Incorrect
    });

    expect(result.current.feedback.show).toBe(true);
    expect(result.current.feedback.isCorrect).toBe(false);
    expect(result.current.correctAnswerCount).toBe(0);

    // Wait for delay (1500ms for incorrect choice)
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.currentQuestionIndex).toBe(2);
  });

  it('should enter correction mode on incorrect answer (CalculationPad Mode)', () => {
    const { result } = renderHook(() =>
      useQuiz({
        level: mockLevel,
        answerMode: 'calculationPad',
        onQuizComplete: mockOnQuizComplete,
      })
    );

    advanceCountdown();

    act(() => {
      result.current.handleAnswer(99); // Incorrect
    });

    expect(result.current.feedback.show).toBe(true);
    expect(result.current.feedback.isCorrect).toBe(false);

    // Wait for delay (500ms before correction mode)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.feedback.show).toBe(false);
    expect(result.current.isCorrectionMode).toBe(true);
    expect(result.current.isAnswering).toBe(false);
    expect(result.current.currentQuestionIndex).toBe(1);

    // Simulate user correcting logic
    act(() => {
        result.current.handleNextQuestion();
    });
    expect(result.current.isCorrectionMode).toBe(false);
    expect(result.current.currentQuestionIndex).toBe(2);
  });

  it('should complete the quiz after last question', () => {
    const { result } = renderHook(() =>
      useQuiz({
        level: mockLevel,
        answerMode: 'choice',
        onQuizComplete: mockOnQuizComplete,
      })
    );

    advanceCountdown();

    // Q1
    act(() => {
      result.current.handleAnswer(2);
      vi.advanceTimersByTime(500);
    });

    // Q2
    act(() => {
      result.current.handleAnswer(2);
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentQuestionIndex).toBe(3);
    expect(mockOnQuizComplete).toHaveBeenCalledWith(100, expect.any(Number));
  });
});
