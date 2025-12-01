import React, { useState } from "react";
import { UserProfile } from "../types";

interface UserSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  currentUser: UserProfile | null;
  onSwitchUser: (userId: string) => void;
  onCreateNewUser: () => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserSwitchModal({
  isOpen,
  onClose,
  users,
  currentUser,
  onSwitchUser,
  onCreateNewUser,
  onDeleteUser,
}: UserSwitchModalProps) {
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeleteClick = (e: React.MouseEvent, user: UserProfile) => {
    e.stopPropagation();
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
      setShowDeleteSuccess(true);
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 2000);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      {/* Delete Confirmation Overlay */}
      {userToDelete && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-pop-in border-4 border-red-100">
            <h3 className="text-xl font-black text-center text-red-500 mb-4">
              かくにん
            </h3>
            <p className="text-center font-bold text-slate-700 mb-6 whitespace-pre-line">
              本当にこのユーザーを削除しますか？
              {"\n"}
              削除すると履歴も消えます
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-colors"
              >
                やめる
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-[0_4px_0_rgb(185,28,28)] active:shadow-none active:translate-y-[4px] transition-all"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Feedback */}
      {showDeleteSuccess && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[70] bg-green-500 text-white font-bold px-6 py-3 rounded-full shadow-lg animate-bounce">
          削除しました
        </div>
      )}

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
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 group relative ${
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

              <div className="flex items-center gap-2">
                {currentUser?.id === user.id ? (
                  <span className="text-brand-blue font-bold text-lg">
                    プレイ中
                  </span>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleDeleteClick(e, user)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="ユーザーを削除"
                    data-testid={`delete-user-${user.id}`}
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
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                )}
              </div>
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
