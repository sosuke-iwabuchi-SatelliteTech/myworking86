import { HistoryRecord, GameSettings, UserProfile } from "../types";
import { SETTINGS_STORAGE_KEY, USER_PROFILE_STORAGE_KEY } from "../constants";

const STORAGE_KEY = "quiz_history";
const MAX_HISTORY_ITEMS = 10;

/**
 * localStorageからクイズの履歴を取得します。
 * パースに失敗した場合は空の配列を返します。
 * @returns クイズ履歴レコードの配列
 */
export function getHistory(): HistoryRecord[] {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return [];
    }
    return JSON.parse(json) as HistoryRecord[];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
}

/**
 * 新しいクイズの記録を履歴に保存します。
 * 履歴は新しいものが先頭になるようにソートされ、最大10件まで保持されます。
 * @param record 保存する新しい履歴レコード
 */
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
    console.error("Failed to save history", e);
  }
}

/**
 * localStorageからすべてのクイズ履歴を削除します。
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}

/**
 * localStorageからゲーム設定を取得します。
 * 設定が存在しない場合やパースに失敗した場合は、デフォルト設定を返します。
 * @returns ゲーム設定オブジェクト
 */
export function getSettings(): GameSettings {
  try {
    const json = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const defaults: GameSettings = { showTimer: true, penSize: 2 };
    if (!json) {
      return defaults;
    }
    const stored = JSON.parse(json);
    return { ...defaults, ...stored };
  } catch (e) {
    console.error("Failed to parse settings", e);
    return { showTimer: true, penSize: 2 };
  }
}

/**
 * ゲーム設定をlocalStorageに保存します。
 * @param settings 保存するゲーム設定オブジェクト
 */
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
}

/**
 * localStorageからユーザープロフィールを取得します。
 * @returns ユーザープロフィール、または存在しない場合はnull
 */
export function getUserProfile(): UserProfile | null {
  try {
    const json = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!json) {
      return null;
    }
    return JSON.parse(json) as UserProfile;
  } catch (e) {
    console.error("Failed to parse user profile", e);
    return null;
  }
}

/**
 * ユーザープロフィールをlocalStorageに保存します。
 * @param profile 保存するユーザープロフィール
 */
export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
}
