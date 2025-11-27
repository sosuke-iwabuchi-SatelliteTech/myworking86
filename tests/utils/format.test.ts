import { describe, it, expect } from 'vitest';
import { getMedal } from '../../src/utils/format';

describe('getMedal', () => {
  it('should return a gold medal for a perfect score within 20 seconds', () => {
    expect(getMedal(100, 20000)).toBe('🥇');
    expect(getMedal(100, 15000)).toBe('🥇');
  });

  it('should return a silver medal for a perfect score within 30 seconds', () => {
    expect(getMedal(100, 30000)).toBe('🥈');
    expect(getMedal(100, 25000)).toBe('🥈');
  });

  it('should return null for a perfect score over 30 seconds', () => {
    expect(getMedal(100, 30001)).toBe(null);
  });

  it('should return null for a score less than 100', () => {
    expect(getMedal(90, 15000)).toBe(null);
    expect(getMedal(0, 22000)).toBe(null);
  });

  it('should return null if time is not provided', () => {
    expect(getMedal(100)).toBe(null);
  });
});
