import React from "react";
import { UserProfile } from "../types";

interface UserSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile | null;
  onSwitchUser: (userId: string) => void;
  onCreateNewUser: () => void;
}

export default function UserSwitchModal({
  isOpen,
  onClose,
  users,
  currentUser,
  onSwitchUser,
  onCreateNewUser,
}: UserSwitchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="とじる"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-3xl font-black text-center text-slate-800 mb-8 mt-2">
          ユーザーきりかえ
        </h2>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSwitchUser(user.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                currentUser?.id === user.id
                  ? "bg-blue-50 border-brand-blue ring-2 ring-blue-200"
                  : "bg-white border-slate-200 hover:border-brand-blue hover:bg-blue-50"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-slate-800">
                  {user.nickname}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  {user.grade}ねんせい
                </span>
              </div>
              {currentUser?.id === user.id && (
                <span className="text-brand-blue font-bold text-lg">
                  プレイ中
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={onCreateNewUser}
            className="w-full bg-brand-yellow hover:bg-yellow-300 text-slate-800 font-black text-xl py-4 rounded-2xl shadow-[0_4px_0_rgb(217,179,16)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M12 4v16m8-8H4"
              />
            </svg>
            あたらしくつくる
          </button>
        </div>
      </div>
    </div>
  );
}
