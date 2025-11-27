/**
 * 正解数と総問題数に基づいてスコアを計算します。
 * スコアは100点満点で、小数点以下は切り上げられます。
 *
 * @param correctAnswers 正解した問題の数
 * @param totalQuestions 総問題数
 * @returns 計算されたスコア（整数）
 */
export function calculateScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) {
    return 0;
  }
  const score = (correctAnswers / totalQuestions) * 100;
  return Math.ceil(score);
}
