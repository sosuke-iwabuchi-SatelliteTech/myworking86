import { useState } from 'react';
import { HistoryRecord, MedalCriteria } from '../types';
import { formatTime, getMedal } from '../utils/format';
import { GRADES } from '../constants';

/**
 * HistoryScreenコンポーネントのprops
 */
interface HistoryScreenProps {
  /**
   * 表示する履歴レコードの配列
   */
  history: HistoryRecord[];
  /**
   * 「もどる」ボタンがクリックされたときに呼び出されるコールバック関数
   */
  onBack: () => void;
  /**
   * 履歴をすべて消去するボタンがクリックされたときに呼び出されるコールバック関数
   */
  onClearHistory: () => void;
}

/**
 * タイムスタンプを YYYY/MM/DD HH:mm 形式の文字列にフォーマットします。
 * @param timestamp フォーマットするタイムスタンプ（ミリ秒）
 * @returns フォーマットされた日付文字列
 */
function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * レベルIDから対応するレベル名を取得します。
 * @param levelId レベルID
 * @returns レベル名。見つからない場合はレベルIDをそのまま返します。
 */
const getLevelName = (levelId: string): string => {
  for (const grade of GRADES) {
    const level = grade.levels.find((l) => l.id === levelId);
    if (level) {
      return level.name;
    }
  }
  return levelId;
};

/**
 * レベルIDから対応するメダル獲得条件を取得します。
 * @param levelId レベルID
 * @returns メダル獲得条件。見つからない場合はundefined。
 */
const getMedalCriteria = (levelId: string): MedalCriteria | undefined => {
  for (const grade of GRADES) {
    const level = grade.levels.find((l) => l.id === levelId);
    if (level) {
      return level.medalCriteria;
    }
  }
  return undefined;
};

/**
 * 過去のクイズの成績履歴を表示するコンポーネント。
 * 履歴のリスト表示と、全履歴を削除する機能を提供します。
 * @param {HistoryScreenProps} props - コンポーネントのprops
 */
export default function HistoryScreen({ history, onBack, onClearHistory }: HistoryScreenProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    onClearHistory();
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 text-center border-4 border-white ring-4 ring-brand-blue relative max-w-lg w-full">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">これまでのせいせき</h2>

      <div className="bg-slate-50 rounded-2xl p-4 mb-8 border-2 border-slate-100 max-h-[60vh] overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-slate-400 font-bold py-8">まだデータがありません</p>
        ) : (
          <div className="space-y-3">
            {history.map((record, index) => {
              const levelName = getLevelName(record.level);
              const gradeName = record.grade ? GRADES.find((g) => g.grade === record.grade)?.name : null;
              const medalCriteria = getMedalCriteria(record.level);

              return (
                <div
                  key={index}
                  data-testid="history-item"
                  className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-400 mb-1">{formatDate(record.timestamp)}</div>
                    {gradeName && <div className="font-bold text-slate-500 text-xs">学年: {gradeName}</div>}
                    <div className="font-bold text-slate-600 text-sm">単元: {levelName}</div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div>
                      <span className="text-2xl font-black text-brand-orange">{record.score}</span>
                      <span className="text-xs font-bold text-slate-400 ml-1">点</span>
                    </div>
                    {record.time && (
                      <div className="text-slate-500 font-mono text-xs mt-1 flex items-center gap-1">
                        <span>{getMedal(record.score, record.time, medalCriteria)}</span>
                        <span>{formatTime(record.time)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_rgb(170,178,189)] active:shadow-[0_0px_0_rgb(170,178,189)] active:translate-y-[6px] transition-all"
      >
        もどる
      </button>

      {history.length > 0 && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full mt-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors"
        >
          履歴をすべて消す
        </button>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
              ほんとうに すべての
              <br />
              きろくを けしますか？
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-all"
              >
                けす
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                やめる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
