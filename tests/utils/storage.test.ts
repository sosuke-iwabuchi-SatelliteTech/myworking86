import { describe, it, expect, beforeEach } from 'vitest';
import { getHistory, saveRecord, clearHistory, getSettings, saveSettings } from '../../src/utils/storage';
import { HistoryRecord } from '../../src/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockRecord: HistoryRecord = {
  timestamp: 1,
  score: 100,
  level: { id: 'test', name: 'Test' },
  time: 10000,
};

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('History', () => {
    it('should get empty history', () => {
      expect(getHistory()).toEqual([]);
    });

    it('should save and get a record', () => {
      saveRecord(mockRecord);
      const history = getHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(mockRecord);
    });

    it('should add a new record and sort by timestamp', () => {
      const olderRecord = { ...mockRecord, timestamp: 0 };
      const newerRecord = { ...mockRecord, timestamp: 2 };
      saveRecord(olderRecord);
      saveRecord(newerRecord);
      const history = getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual(newerRecord);
      expect(history[1]).toEqual(olderRecord);
    });

    it('should only keep the latest 10 records', () => {
      for (let i = 0; i < 15; i++) {
        saveRecord({ ...mockRecord, timestamp: i });
      }
      const history = getHistory();
      expect(history).toHaveLength(10);
      expect(history[0].timestamp).toBe(14);
    });

    it('should clear history', () => {
      saveRecord(mockRecord);
      clearHistory();
      expect(getHistory()).toEqual([]);
    });
  });

  describe('Settings', () => {
    it('should get default settings', () => {
      expect(getSettings()).toEqual({ showTimer: true, penSize: 2 });
    });

    it('should save and get settings', () => {
      const newSettings = { showTimer: false, penSize: 2 };
      saveSettings(newSettings);
      expect(getSettings()).toEqual(newSettings);
    });
  });
});
