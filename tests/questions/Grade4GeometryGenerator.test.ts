import { describe, it, expect } from 'vitest';
import { Grade4GeometryGenerator } from '../../src/questions/Grade4GeometryGenerator';
import { Question } from '../../src/types';

describe('Grade4GeometryGenerator', () => {
  const generator = new Grade4GeometryGenerator();
  const TEST_ITERATIONS = 30; // Increased iterations for better shape coverage

  it('should generate a valid question object with geometry data', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question).toHaveProperty('text');
      expect(question).toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('options');
      expect(question).toHaveProperty('geometry');
      expect(question.geometry).toBeDefined();
    }
  });

  it('should have 4 unique options including the correct answer', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options).toContain(question.correctAnswer);
    }
  });

  it('should always have an integer as the correct answer', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      expect(Number.isInteger(question.correctAnswer)).toBe(true);
    }
  });

  it('should generate a mathematically correct problem for the given shape', () => {
    for (let i = 0; i < TEST_ITERATIONS; i++) {
      const question = generator.generate();
      const { shape, dimensions } = question.geometry!;
      let expectedAnswer;

      switch (shape) {
        case 'rectangle':
          expectedAnswer = dimensions.width * dimensions.height;
          break;
        case 'triangle':
          expectedAnswer = (dimensions.width * dimensions.height) / 2;
          break;
        case 'trapezoid':
          // Note: In the generator, trapezoid's 'lower' is mapped to 'width'
          expectedAnswer = ((dimensions.upper! + dimensions.width) * dimensions.height) / 2;
          break;
        default:
          throw new Error(`Unknown shape: ${shape}`);
      }
      expect(question.correctAnswer).toBe(expectedAnswer);
    }
  });
});
