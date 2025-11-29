import { describe, it, expect, beforeEach, vi } from "vitest";
import { getUserProfile, saveUserProfile, getCurrentUser } from "../../src/utils/storage";
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
      nickname: "TestUser",
      grade: 3,
    };

    saveUserProfile(testProfile);
    const retrieved = getUserProfile();

    expect(retrieved).not.toBeNull();
    expect(retrieved?.nickname).toBe(testProfile.nickname);
    expect(retrieved?.grade).toBe(testProfile.grade);
    expect(retrieved?.id).toBeDefined(); // Now it has an ID
  });

  it("should return null if json parsing fails (simulated by corrupted users list)", () => {
    // Note: getUserProfile now delegates to getCurrentUser, which reads from USERS_STORAGE_KEY.
    // If USERS_STORAGE_KEY is corrupted, it should fail gracefully.
    localStorage.setItem("quiz_users", "invalid-json");

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const profile = getUserProfile();
    expect(profile).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
