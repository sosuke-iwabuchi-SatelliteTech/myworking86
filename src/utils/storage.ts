import { HistoryRecord } from '../types';

const STORAGE_KEY = 'quiz_history';
const MAX_HISTORY_ITEMS = 10;

export function getHistory(): HistoryRecord[] {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) {
            return [];
        }
        return JSON.parse(json);
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
