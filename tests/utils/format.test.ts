import { describe, it, expect } from 'vitest';
import { getMedal, formatTime } from '../../src/utils/format';

describe('formatTime', () => {
  it('should format milliseconds to MM:SS.ms', () => {
    expect(formatTime(0)).toBe('00:00.00');
    expect(formatTime(1000)).toBe('00:01.00');
    expect(formatTime(1500)).toBe('00:01.50');
    expect(formatTime(60000)).toBe('01:00.00');
    expect(formatTime(65432)).toBe('01:05.43');
    // Check floor behavior for milliseconds (1239ms -> .23)
    expect(formatTime(1239)).toBe('00:01.23');
  });
});

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
