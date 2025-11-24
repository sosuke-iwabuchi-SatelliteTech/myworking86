import { HistoryRecord, GameLevel } from '../types';
import { LEVEL_IDS } from '../constants';

const STORAGE_KEY = 'quiz_history';
const MAX_HISTORY_ITEMS = 10;

// Helper to migrate legacy numeric levels to string IDs
function migrateLevel(level: any): GameLevel {
    if (level === 1) return LEVEL_IDS.GRADE_1_CALC;
    if (level === 2) return LEVEL_IDS.GRADE_2_KUKU;
    if (level === 3) return LEVEL_IDS.GRADE_4_GEOMETRY;
    return level as GameLevel;
}

export function getHistory(): HistoryRecord[] {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) {
            return [];
        }
        const data = JSON.parse(json);

        // Migrate data on read
        return data.map((record: any) => ({
            ...record,
            level: migrateLevel(record.level)
        }));
    } catch (e) {
        console.error('Failed to parse history', e);
        return [];
    }
}

export function saveRecord(record: HistoryRecord): void {
    const history = getHistory();
    // Add new record
    history.push(record);

    // Sort by timestamp descending (newest first)
    history.sort((a, b) => b.timestamp - a.timestamp);

    // Keep only the top MAX_HISTORY_ITEMS
    const newHistory = history.slice(0, MAX_HISTORY_ITEMS);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error('Failed to save history', e);
    }
}

export function clearHistory(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear history', e);
    }
}
