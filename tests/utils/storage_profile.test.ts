import { describe, it, expect, beforeEach, vi } from "vitest";
import { getUserProfile, saveUserProfile } from "../../src/utils/storage";
import { USER_PROFILE_STORAGE_KEY } from "../../src/constants";
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

    expect(retrieved).toEqual(testProfile);
  });

  it("should return null if json parsing fails", () => {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, "invalid-json");

    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const profile = getUserProfile();
    expect(profile).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
