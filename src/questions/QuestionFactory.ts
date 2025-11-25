import { GameLevel } from '../types';
import { QuestionGenerator } from './QuestionGenerator';
import { Grade1CalcGenerator } from './Grade1CalcGenerator';
import { Grade2KukuGenerator } from './Grade2KukuGenerator';
import { Grade4GeometryGenerator } from './Grade4GeometryGenerator';
import { Grade4MultiplicationGenerator } from './Grade4MultiplicationGenerator';

/**
 * 問題生成器（QuestionGenerator）のインスタンスを作成するためのファクトリークラス。
 * ゲームレベルに応じて適切なジェネレーターを返します。
 */
export class QuestionFactory {
  /**
   * 指定されたゲームレベルに対応するQuestionGeneratorのインスタンスを生成します。
   * @param level ゲームレベルID
   * @returns 対応するQuestionGeneratorのインスタンス
   * @throws 指定されたレベルに対応するジェネレーターが見つからない場合にエラーをスローします。
   */
  static create(level: GameLevel): QuestionGenerator {
    switch (level) {
      case 'grade-1-calc':
        return new Grade1CalcGenerator();
      case 'grade-2-kuku':
        return new Grade2KukuGenerator();
      case 'grade-4-geometry':
        return new Grade4GeometryGenerator();
      case 'grade-4-multiplication':
        return new Grade4MultiplicationGenerator();
      default:
        throw new Error(`Generator not found for level: ${level}`);
    }
  }
}
