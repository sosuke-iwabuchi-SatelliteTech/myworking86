import { describe, it, expect } from 'vitest';
import { calculateScore } from '../src/utils/score';

describe('calculateScore', () => {
  it('should return 100 when all questions are correct', () => {
    expect(calculateScore(10, 10)).toBe(100);
    expect(calculateScore(3, 3)).toBe(100);
  });

  it('should return 0 when no questions are correct', () => {
    expect(calculateScore(0, 10)).toBe(0);
  });

  it('should return 0 when there are no questions', () => {
    expect(calculateScore(0, 0)).toBe(0);
  });

  it('should calculate the score correctly for a standard case', () => {
    // 8 / 10 = 80
    expect(calculateScore(8, 10)).toBe(80);
  });

  it('should round up the score to the nearest integer', () => {
    // 1 / 3 = 33.33... -> 34
    expect(calculateScore(1, 3)).toBe(34);
    // 2 / 3 = 66.66... -> 67
    expect(calculateScore(2, 3)).toBe(67);
    // 99 / 100 = 99
    expect(calculateScore(99, 100)).toBe(99);
     // 1 / 7 = 14.28 -> 15
    expect(calculateScore(1, 7)).toBe(15);
  });
});
