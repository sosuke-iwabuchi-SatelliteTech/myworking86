import { describe, it, expect } from 'vitest';
import { Grade2KukuGenerator } from '../../src/questions/Grade2KukuGenerator';

describe('Grade2KukuGenerator', () => {
  const generator = new Grade2KukuGenerator();
  const TEST_ITERATIONS = 20;

  it('should generate a valid question object', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('options');
    }
  });

  it('should always include the correct answer in the options', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question.options).toContain(question.correctAnswer);
    }
  });

  it('should have 4 unique options', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
    }
  });

  it('should generate a mathematically correct problem', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      // Simple parsing, assuming "num1 × num2 = ?" format
      const parts = question.text.split(' ');
      const num1 = parseInt(parts[0], 10);
      const num2 = parseInt(parts[2], 10);
      expect(question.correctAnswer).toBe(num1 * num2);
    }
  });
});
