import { Question, AnswerMode } from '../types';

/**
 * クイズの問題を生成するためのインターフェース。
 * 各レベルの問題生成ロジックは、このインターフェースを実装する必要があります。
 */
export interface QuestionGenerator {
    generate(answerMode: AnswerMode): Question;
}
