/**
 * ミリ秒を MM:SS.ms 形式の文字列にフォーマットします。
 * @param ms フォーマットする時間（ミリ秒）
 * @returns フォーマットされた時間文字列
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

/**
 * スコアと時間に基づいて、獲得したメダル（絵文字）を返します。
 * スコアが100点でない場合、またはタイムが設定されていない場合はメダルを獲得できません。
 * - 20秒以内: 金メダル 🥇
 * - 25秒以内: 銀メダル 🥈
 * @param score ユーザーのスコア
 * @param time 経過時間（ミリ秒）
 * @returns 条件を満たす場合はメダルの絵文字、それ以外はnull
 */
export function getMedal(score: number, time?: number): string | null {
  if (!time || score !== 100) return null;
  if (time <= 20000) return '🥇';
  if (time <= 25000) return '🥈';
  return null;
}
