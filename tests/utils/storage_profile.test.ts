import { describe, it, expect, beforeEach, vi } from "vitest";
import { getUserProfile, saveUserProfile, getUsers, setCurrentUser, deleteUserProfile, saveRecord } from "../../src/utils/storage";
import { USER_LIST_STORAGE_KEY } from "../../src/constants";
import { UserProfile } from "../../src/types";

describe("Storage Utils - User Profile", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should return null if no profile exists", () => {
    const profile = getUserProfile();
    expect(profile).toBeNull();
  });

  it("should save and retrieve user profile", () => {
    const testProfile: UserProfile = {
      id: "test-id-1",
      nickname: "TestUser",
      grade: 3,
    };

    saveUserProfile(testProfile);
    const retrieved = getUserProfile();

    expect(retrieved).toEqual(testProfile);
  });

  it("should manage multiple users correctly", () => {
    const user1: UserProfile = { id: "u1", nickname: "User1", grade: 1 };
    const user2: UserProfile = { id: "u2", nickname: "User2", grade: 2 };

    saveUserProfile(user1);
    saveUserProfile(user2);

    // After saving user2, it should be the current user
    expect(getUserProfile()).toEqual(user2);

    // Switch back to user1
    setCurrentUser(user1.id);
    expect(getUserProfile()).toEqual(user1);

    // Verify all users are stored
    const allUsers = getUsers();
    expect(allUsers).toHaveLength(2);
    expect(allUsers).toContainEqual(user1);
    expect(allUsers).toContainEqual(user2);
  });

  it("should return null (or valid user if migration happens) if json parsing fails", () => {
    localStorage.setItem(USER_LIST_STORAGE_KEY, "invalid-json");

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const profile = getUserProfile();
    expect(profile).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should delete user profile and their history", () => {
    const user1: UserProfile = { id: "u1", nickname: "User1", grade: 1 };
    const user2: UserProfile = { id: "u2", nickname: "User2", grade: 2 };

    saveUserProfile(user1);
    saveUserProfile(user2); // user2 is now current

    // Add history for user 2
    saveRecord({
        timestamp: 123,
        score: 100,
        levelId: 'grade-1-calc',
        time: 10
    });

    // Verify history exists
    expect(localStorage.getItem('quiz_history_u2')).not.toBeNull();

    // Delete user 2
    deleteUserProfile(user2.id);

    // Verify user 2 is gone
    const allUsers = getUsers();
    expect(allUsers).toHaveLength(1);
    expect(allUsers[0]).toEqual(user1);

    // Verify history is gone
    expect(localStorage.getItem('quiz_history_u2')).toBeNull();
  });
});
