import { describe, it, expect } from 'vitest';
import { shuffle, sample } from '../../src/utils/array';

describe('shuffle', () => {
  const originalArray = [1, 2, 3, 4, 5];

  it('should return a new array with the same length', () => {
    const shuffled = shuffle(originalArray);
    expect(shuffled).toHaveLength(originalArray.length);
  });

  it('should not modify the original array', () => {
    const originalCopy = [...originalArray];
    shuffle(originalArray);
    expect(originalArray).toEqual(originalCopy);
  });

  it('should contain the same elements as the original array', () => {
    const shuffled = shuffle(originalArray);
    expect(shuffled.sort()).toEqual(originalArray.sort());
  });

  it('should return an empty array if an empty array is passed', () => {
    expect(shuffle([])).toEqual([]);
  });
});

describe('sample', () => {
  const originalArray = [1, 2, 3, 4, 5];

  it('should return an element from the original array', () => {
    const result = sample(originalArray);
    expect(originalArray).toContain(result);
  });

  it('should return undefined for an empty array', () => {
    expect(sample([])).toBeUndefined();
  });
});
