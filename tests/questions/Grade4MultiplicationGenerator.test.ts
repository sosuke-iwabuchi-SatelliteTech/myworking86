import { describe, it, expect } from 'vitest';
import { Grade4MultiplicationGenerator } from '../../src/questions/Grade4MultiplicationGenerator';

describe('Grade4MultiplicationGenerator', () => {
  const generator = new Grade4MultiplicationGenerator();
  const TEST_ITERATIONS = 20;

  it('should generate a valid question object', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('showCalculationPad', true);
      expect(question).toHaveProperty('num1');
      expect(question).toHaveProperty('num2');
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
      // 'num1' and 'num2' should be the source of truth
      const { num1, num2, correctAnswer } = question;
      expect(correctAnswer).toBe(num1! * num2!);
    }
  });
});
