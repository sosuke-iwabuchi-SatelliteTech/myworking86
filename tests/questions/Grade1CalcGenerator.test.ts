import { describe, it, expect } from 'vitest';
import { Grade1CalcGenerator } from '../../src/questions/Grade1CalcGenerator';

describe('Grade1CalcGenerator', () => {
  const generator = new Grade1CalcGenerator();

  // Run tests multiple times to account for randomness
  const TEST_ITERATIONS = 20;

  it('should generate a valid question object', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('options');
      expect(typeof question.text).toBe('string');
      expect(typeof question.correctAnswer).toBe('number');
      expect(Array.isArray(question.options)).toBe(true);
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
      const uniqueOptions = new Set(question.options);
      expect(uniqueOptions.size).toBe(4);
    }
  });

  it('should generate a mathematically correct problem', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      const parts = question.text.split(' ');
      const num1 = parseInt(parts[0], 10);
      const operator = parts[1];
      const num2 = parseInt(parts[2], 10);

      let expectedAnswer;
      if (operator === '+') {
        expectedAnswer = num1 + num2;
      } else if (operator === '-') {
        expectedAnswer = num1 - num2;
      } else {
        throw new Error(`Invalid operator in question text: ${question.text}`);
      }

      expect(question.correctAnswer).toBe(expectedAnswer);
    }
  });
});
