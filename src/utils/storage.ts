import { HistoryRecord, GameSettings, UserProfile, LevelStats, UserLevelStats } from "../types";
import {
  SETTINGS_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
  USER_LIST_STORAGE_KEY,
  CURRENT_USER_ID_STORAGE_KEY,
} from "../constants";

export const QUIZ_STATS_PREFIX = "quiz_stats_";

// The history storage key depends on the current user.
// We need a helper to get the key for the current user.
const getHistoryKey = () => {
  const currentUser = getCurrentUserId();
  if (currentUser) {
    return `quiz_history_${currentUser}`;
  }
  // Fallback for legacy or unknown user (should eventually be migrated)
  return "quiz_history";
};

// Helper to get stats key for current user
const getStatsKey = () => {
  const currentUser = getCurrentUserId();
  if (currentUser) {
    return `${QUIZ_STATS_PREFIX}${currentUser}`;
  }
  return `${QUIZ_STATS_PREFIX}legacy`;
};

const MAX_HISTORY_ITEMS = 10;

/**
 * localStorageからクイズの履歴を取得します。
 * パースに失敗した場合は空の配列を返します。
 * @returns クイズ履歴レコードの配列
 */
export function getHistory(): HistoryRecord[] {
  try {
    const key = getHistoryKey();
    const json = localStorage.getItem(key);
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
    const key = getHistoryKey();
    localStorage.setItem(key, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

/**
 * localStorageからすべてのクイズ履歴を削除します。
 */
export function clearHistory(): void {
  try {
    const key = getHistoryKey();
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Failed to clear history", e);
  }
}

/**
 * ユーザーの全レベルの統計情報を取得します。
 */
export function getUserLevelStats(): UserLevelStats {
  try {
    const key = getStatsKey();
    const json = localStorage.getItem(key);
    if (!json) {
      return {};
    }
    return JSON.parse(json) as UserLevelStats;
  } catch (e) {
    console.error("Failed to parse level stats", e);
    return {};
  }
}

/**
 * 特定のレベルの統計情報を取得します。
 */
export function getLevelStats(levelId: string): LevelStats | null {
  const stats = getUserLevelStats();
  return stats[levelId] || null;
}

/**
 * レベルの統計情報を更新します。
 */
export function updateLevelStats(levelId: string, score: number, time: number): void {
  const statsMap = getUserLevelStats();
  const currentStats = statsMap[levelId] || {
    levelId,
    bestScore: 0,
    playCount: 0,
  };

  // Update play count
  currentStats.playCount += 1;

  // Update best score
  if (score > currentStats.bestScore) {
    currentStats.bestScore = score;
  }

  // Update fastest perfect time if score is 100
  if (score === 100) {
    if (
      currentStats.fastestPerfectTime === undefined ||
      currentStats.fastestPerfectTime === null ||
      time < currentStats.fastestPerfectTime
    ) {
      currentStats.fastestPerfectTime = time;
    }
  }

  statsMap[levelId] = currentStats;

  try {
    const key = getStatsKey();
    localStorage.setItem(key, JSON.stringify(statsMap));
  } catch (e) {
    console.error("Failed to save level stats", e);
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
 * すべてのユーザーリストを取得します。
 */
export function getUsers(): UserProfile[] {
  try {
    const json = localStorage.getItem(USER_LIST_STORAGE_KEY);
    if (!json) {
      // Migrate legacy single user if exists
      const legacyJson = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (legacyJson) {
        const legacyUser = JSON.parse(legacyJson);
        // If legacy user doesn't have an ID, give it one.
        // Although the type definition now requires ID, the legacy data won't have it.
        if (!legacyUser.id) {
          legacyUser.id = crypto.randomUUID();
        }
        const users = [legacyUser as UserProfile];
        saveUsers(users);
        setCurrentUser(legacyUser.id);
        // Also need to migrate history?
        // For simplicity, we might leave old history behind or move it.
        // Let's copy old history to new user key.
        const oldHistory = localStorage.getItem("quiz_history");
        if (oldHistory) {
            localStorage.setItem(`quiz_history_${legacyUser.id}`, oldHistory);
        }

        return users;
      }
      return [];
    }
    return JSON.parse(json) as UserProfile[];
  } catch (e) {
    console.error("Failed to parse users", e);
    return [];
  }
}

/**
 * ユーザーリストを保存します。
 */
function saveUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USER_LIST_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users", e);
  }
}

/**
 * 現在のユーザーIDを取得します。
 */
export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);
}

/**
 * 現在のユーザーIDを設定します。
 */
export function setCurrentUser(userId: string): void {
  localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userId);
}

/**
 * 新しいユーザーを追加または更新します。
 */
export function saveUserProfile(profile: UserProfile): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === profile.id);

  if (index >= 0) {
    users[index] = profile;
  } else {
    users.push(profile);
  }

  saveUsers(users);
  setCurrentUser(profile.id);
}

/**
 * 現在アクティブなユーザープロフィールを取得します。
 */
export function getUserProfile(): UserProfile | null {
    const users = getUsers();
    const currentId = getCurrentUserId();

    if (!currentId) {
        if (users.length > 0) {
            // If we have users but no current ID, default to the first one
            setCurrentUser(users[0].id);
            return users[0];
        }
        return null;
    }

    const user = users.find(u => u.id === currentId);
    return user || null;
}

/**
 * 指定されたユーザーとその履歴を削除します。
 */
export function deleteUserProfile(userId: string): void {
  const users = getUsers();
  const newUsers = users.filter(u => u.id !== userId);
  saveUsers(newUsers);

  // Remove history
  try {
    localStorage.removeItem(`quiz_history_${userId}`);
  } catch (e) {
    console.error("Failed to delete history for user", userId, e);
  }
}
