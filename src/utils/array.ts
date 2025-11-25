// src/utils/array.ts

/**
 * 配列の要素をシャッフル（ランダムに並び替え）します。
 * 元の配列は変更されません。
 * @param array シャッフルする配列
 * @returns シャッフルされた新しい配列
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 配列からランダムに1つの要素を返します。
 * @param array 要素を取得する配列
 * @returns ランダムに選ばれた要素。配列が空の場合はundefinedを返します。
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}
