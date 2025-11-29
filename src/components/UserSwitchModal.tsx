import { User } from "../types";

interface UserSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string | undefined;
  onSelectUser: (userId: string) => void;
  onAddUser: () => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserSwitchModal({
  isOpen,
  onClose,
  users,
  currentUserId,
  onSelectUser,
  onAddUser,
  onDeleteUser,
}: UserSwitchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
          aria-label="とじる"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">ユーザーきりかえ</h2>

        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {users.map((user) => (
            <div
              key={user.id}
              className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                user.id === currentUserId
                  ? "border-brand-blue bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-100 hover:border-slate-200 bg-white"
              }`}
            >
              <button
                onClick={() => onSelectUser(user.id)}
                className="flex-1 text-left outline-none"
              >
                <div className="font-bold text-lg text-slate-700">{user.nickname}</div>
                <div className="text-sm text-slate-400 font-bold">{user.grade}ねんせい</div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.confirm(`${user.nickname}さんのデータをさくじょしますか？\n（もとにはもどせません）`)) {
                    onDeleteUser(user.id);
                  }
                }}
                className="p-2 ml-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                aria-label={`${user.nickname}を削除`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onAddUser}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-500 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          あたらしいユーザー
        </button>
      </div>
    </div>
  );
}
