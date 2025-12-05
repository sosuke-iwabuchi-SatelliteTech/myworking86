import { useState } from "react";
import { UserProfile } from "../types";
import { saveUserProfile } from "../utils/storage";

interface UserRegistrationScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export default function UserRegistrationScreen({ onComplete }: UserRegistrationScreenProps) {
  const [nickname, setNickname] = useState("");
  const [grade, setGrade] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.length > 0 && nickname.length <= 10 && grade !== "") {
      setIsLoading(true);
      setError(null);

      const id = crypto.randomUUID();
      const gradeNum = Number(grade);

      try {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            id,
            name: nickname,
            grade: gradeNum,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || '登録に失敗しました');
        }

        const profile: UserProfile = {
          id,
          nickname,
          grade: gradeNum,
        };

        saveUserProfile(profile);

        onComplete(profile);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('予期せぬエラーが発生しました');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isFormValid = nickname.length > 0 && nickname.length <= 10 && grade !== "";

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 w-full border-4 border-white ring-4 ring-blue-100 relative">
        <div className="mb-8 relative text-center">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
            はじめまして！
          </h1>
          <p className="text-slate-500 font-bold">
            あなたのことをおしえてね
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nickname" className="block text-lg font-bold text-slate-700">
              ニックネーム <span className="text-sm font-normal text-slate-400">（10もじまで）</span>
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={10}
              placeholder="なまえを入力してね"
              className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 font-bold text-slate-800"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="grade" className="block text-lg font-bold text-slate-700">
              がくねん
            </label>
            <div className="relative">
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full text-xl p-4 rounded-xl border-2 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none font-bold text-slate-800 bg-white"
                required
                disabled={isLoading}
              >
                <option value="" disabled>がくねんをえらんでね</option>
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>
                    {g}ねんせい
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full font-black text-2xl py-4 rounded-2xl shadow-[0_6px_0_rgb(74,168,209)] transition-all mt-8 ${isFormValid && !isLoading
              ? "bg-brand-blue hover:bg-blue-300 text-slate-800 active:shadow-[0_0px_0_rgb(74,168,209)] active:translate-y-[6px]"
              : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              }`}
          >
            {isLoading ? "とうろくちゅう..." : "はじめる！"}
          </button>
        </form>
      </div>
    </div>
  );
}
