import { Question } from '../types';

/**
 * クイズの問題を生成するためのインターフェース。
 * 各レベルの問題生成ロジックは、このインターフェースを実装する必要があります。
 */
export interface QuestionGenerator {
  /**
   * 新しい問題を生成します。
   * @returns 生成された問題オブジェクト
   */
  generate(): Question;
}
