import { HistoryRecord, GameSettings, UserProfile, User } from "../types";
import { SETTINGS_STORAGE_KEY, USER_PROFILE_STORAGE_KEY } from "../constants";

const USERS_STORAGE_KEY = "quiz_users";
const CURRENT_USER_ID_KEY = "quiz_current_user_id";
const OLD_HISTORY_KEY = "quiz_history";
const HISTORY_PREFIX = "quiz_history_";
const MAX_HISTORY_ITEMS = 10;

/**
 * IDを生成します
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * 保存されているすべてのユーザーを取得します。
 * 初回実行時に既存のユーザープロフィールが存在する場合は、マイグレーションを行います。
 */
export function getUsers(): User[] {
  try {
    const json = localStorage.getItem(USERS_STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as User[];
    }

    // Migration logic
    const oldProfileJson = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (oldProfileJson) {
      const oldProfile = JSON.parse(oldProfileJson) as UserProfile;
      const newId = generateId();
      const newUser: User = { ...oldProfile, id: newId };

      // Save new user list
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([newUser]));
      // Set as current user
      localStorage.setItem(CURRENT_USER_ID_KEY, newId);

      // Migrate history
      const oldHistoryJson = localStorage.getItem(OLD_HISTORY_KEY);
      if (oldHistoryJson) {
        localStorage.setItem(`${HISTORY_PREFIX}${newId}`, oldHistoryJson);
        // Optional: Remove old history key? Keeping it for safety for now.
      }

      return [newUser];
    }

    return [];
  } catch (e) {
    console.error("Failed to parse users", e);
    return [];
  }
}

/**
 * 現在選択されているユーザーを取得します。
 */
export function getCurrentUser(): User | null {
  try {
    const userId = localStorage.getItem(CURRENT_USER_ID_KEY);
    const users = getUsers();
    if (userId) {
      return users.find(u => u.id === userId) || null;
    }
    // If no current user set but users exist, select the first one
    if (users.length > 0) {
      localStorage.setItem(CURRENT_USER_ID_KEY, users[0].id);
      return users[0];
    }
    return null;
  } catch (e) {
    console.error("Failed to get current user", e);
    return null;
  }
}

/**
 * ユーザーを追加し、そのユーザーに切り替えます。
 */
export function saveUser(profile: UserProfile): User {
  const users = getUsers();
  const newUser: User = { ...profile, id: generateId() };
  users.push(newUser);

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id);
  } catch (e) {
    console.error("Failed to save user", e);
  }
  return newUser;
}

/**
 * 指定したユーザーに切り替えます。
 */
export function switchUser(userId: string): void {
  try {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
  } catch (e) {
    console.error("Failed to switch user", e);
  }
}

/**
 * 指定したユーザーを削除します。
 * 現在のユーザーを削除した場合は、他のユーザーに切り替えるか、ユーザーなし状態になります。
 */
export function deleteUser(userId: string): User | null {
  let users = getUsers();
  users = users.filter(u => u.id !== userId);

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Remove history for this user
    localStorage.removeItem(`${HISTORY_PREFIX}${userId}`);

    const currentUserId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (currentUserId === userId) {
      if (users.length > 0) {
        const nextUser = users[0];
        localStorage.setItem(CURRENT_USER_ID_KEY, nextUser.id);
        return nextUser;
      } else {
        localStorage.removeItem(CURRENT_USER_ID_KEY);
        return null;
      }
    }
    // If we didn't delete the current user, return the current user (re-fetch to be safe)
    return getCurrentUser();
  } catch (e) {
    console.error("Failed to delete user", e);
    return null;
  }
}

/**
 * localStorageから現在のユーザーのクイズ履歴を取得します。
 * @returns クイズ履歴レコードの配列
 */
export function getHistory(): HistoryRecord[] {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];

  try {
    const json = localStorage.getItem(`${HISTORY_PREFIX}${currentUser.id}`);
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
 * 新しいクイズの記録を現在のユーザーの履歴に保存します。
 * @param record 保存する新しい履歴レコード
 */
export function saveRecord(record: HistoryRecord): void {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const history = getHistory();
  // Add new record
  history.push(record);

  // Sort by timestamp descending (newest first)
  history.sort((a, b) => b.timestamp - a.timestamp);

  // Keep only the top MAX_HISTORY_ITEMS
  const newHistory = history.slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(`${HISTORY_PREFIX}${currentUser.id}`, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

/**
 * localStorageから現在のユーザーのクイズ履歴を削除します。
 */
export function clearHistory(): void {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  try {
    localStorage.removeItem(`${HISTORY_PREFIX}${currentUser.id}`);
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
 * 古いgetUserProfile関数のラッパー。
 * 互換性のために残していますが、getCurrentUserの使用を推奨します。
 */
export function getUserProfile(): User | null {
  return getCurrentUser();
}

/**
 * 古いsaveUserProfile関数のラッパー。
 * 実際には新しいユーザーを作成します。
 */
export function saveUserProfile(profile: UserProfile): void {
  saveUser(profile);
}
