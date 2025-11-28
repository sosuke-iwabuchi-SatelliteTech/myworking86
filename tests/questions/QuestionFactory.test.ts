import { describe, it, expect } from 'vitest';
import { QuestionFactory } from '../../src/questions/QuestionFactory';
import { Grade1CalcGenerator } from '../../src/questions/Grade1CalcGenerator';
import { Grade2KukuGenerator } from '../../src/questions/Grade2KukuGenerator';
import { Grade4GeometryGenerator } from '../../src/questions/Grade4GeometryGenerator';
import { Grade4MultiplicationGenerator } from '../../src/questions/Grade4MultiplicationGenerator';

describe('QuestionFactory', () => {
  it('should create Grade1CalcGenerator for grade-1-calc', () => {
    const generator = QuestionFactory.create('grade-1-calc');
    expect(generator).toBeInstanceOf(Grade1CalcGenerator);
  });

  it('should create Grade2KukuGenerator for grade-2-kuku', () => {
    const generator = QuestionFactory.create('grade-2-kuku');
    expect(generator).toBeInstanceOf(Grade2KukuGenerator);
  });

  it('should create Grade4GeometryGenerator for grade-4-geometry', () => {
    const generator = QuestionFactory.create('grade-4-geometry');
    expect(generator).toBeInstanceOf(Grade4GeometryGenerator);
  });

  it('should create Grade4MultiplicationGenerator for grade-4-multiplication', () => {
    const generator = QuestionFactory.create('grade-4-multiplication');
    expect(generator).toBeInstanceOf(Grade4MultiplicationGenerator);
  });

  it('should throw an error for an unknown level', () => {
    expect(() => QuestionFactory.create('unknown-level' as any)).toThrow(
      'Generator not found for level: unknown-level'
    );
  });
});
