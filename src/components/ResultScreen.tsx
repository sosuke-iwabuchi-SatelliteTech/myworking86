import { MedalCriteria } from '../types';
import { formatTime, getMedal } from '../utils/format';

/**
 * ResultScreenコンポーネントのprops
 */
interface ResultScreenProps {
  /**
   * 最終的なスコア
   */
  score: number;
  /**
   * 最終的な経過時間（ミリ秒）
   */
  finalTime: number;
  /**
   * 「もういちど あそぶ」ボタンがクリックされたときに呼び出されるコールバック関数
   */
  onRestart: () => void;
  /**
   * 「さいしょにもどる」ボタンがクリックされたときに呼び出されるコールバック関数
   */
  onGoToTop: () => void;
  /**
   * メダル獲得条件（オプション）
   */
  medalCriteria?: MedalCriteria;
}

/**
 * クイズの結果を表示するコンポーネント。
 * スコア、経過時間、評価メッセージ、および獲得したメダルを表示します。
 * @param {ResultScreenProps} props - コンポーネントのprops
 */
export default function ResultScreen({ score, finalTime, onRestart, onGoToTop, medalCriteria }: ResultScreenProps) {
  let message = 'がんばったね！ つぎはもっといけるよ！ 💪';
  let messageClass = 'text-xl font-bold text-brand-blue';

  if (score === 100) {
    message = 'てんさい！ かんぺきです！ 🌟';
    messageClass = 'text-xl font-bold text-brand-yellow';
  } else if (score >= 80) {
    message = 'すごい！ そのちょうし！ 🎉';
    messageClass = 'text-xl font-bold text-brand-orange';
  }

  const medal = getMedal(score, finalTime, medalCriteria);

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 text-center border-4 border-white ring-4 ring-brand-yellow relative">
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-7xl">
        {medal ? <span className="medal-anim">{medal}</span> : '🏆'}
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mt-8 mb-6">けっかはっぴょう！</h2>

      <div className="bg-slate-50 rounded-2xl p-6 mb-8 border-2 border-slate-100">
        <p className="text-slate-500 font-bold mb-2">あなたのスコア</p>
        <div className="text-6xl font-black text-brand-orange mb-2">
          <span>{score}</span>
          <span className="text-3xl text-slate-400">点</span>
        </div>

        <div className="mb-4 pt-4 border-t-2 border-slate-200">
          <p className="text-slate-500 font-bold mb-1">かかったじかん</p>
          <div className="text-4xl font-black text-slate-700 font-mono">{formatTime(finalTime)}</div>
        </div>

        <p className={messageClass}>{message}</p>
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-brand-green hover:bg-green-400 text-white font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_rgb(86,168,98)] active:shadow-[0_0px_0_rgb(86,168,98)] active:translate-y-[6px] transition-all"
      >
        もういちど あそぶ
      </button>
      <button
        onClick={onGoToTop}
        className="w-full bg-brand-blue hover:bg-blue-300 text-slate-800 font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_rgb(74,168,209)] active:shadow-[0_0px_0_rgb(74,168,209)] active:translate-y-[6px] transition-all mt-4"
      >
        さいしょにもどる
      </button>
    </div>
  );
}
