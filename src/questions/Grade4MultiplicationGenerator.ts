import { Question, AnswerMode } from "../types";
import { QuestionGenerator } from "./QuestionGenerator";
import { sample, shuffle } from "../utils/array";

/**
 * 4年生レベルの掛け算問題（2桁 × 2桁）を生成するクラス。
 * 計算パッドを表示する設定が含まれます。
 */
export class Grade4MultiplicationGenerator implements QuestionGenerator {
  generate(answerMode: AnswerMode): Question {
    const num1 = Math.floor(Math.random() * 90) + 10;
    const num2 = Math.floor(Math.random() * 90) + 10;
    const correctAnswer = num1 * num2;

    if (answerMode === 'calculationPad') {
      return {
        text: `${num1} x ${num2}`,
        correctAnswer: correctAnswer,
        options: [],
        showCalculationPad: true,
        num1: num1,
        num2: num2,
      };
    } else {
      // Default to 'choice' mode
      const options = this.generateOptions(correctAnswer);
      return {
        text: `${num1} x ${num2}`,
        correctAnswer: correctAnswer,
        options: shuffle(options),
        showCalculationPad: false,
        num1: num1,
        num2: num2,
      };
    }
  }

  /**
   * 正解を含む4つの選択肢の配列を生成します。
   * @param correctAnswer 正解の数値
   * @returns 正解と3つの不正解の選択肢を含む配列
   */
  private generateOptions(correctAnswer: number): number[] {
    const options = [correctAnswer];
    while (options.length < 4) {
      const option = this.generateRandomOption(correctAnswer);
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    return options;
  }

  /**
   * 正解に近いが間違っている選択肢を1つ生成します。
   * エラーのタイプ（ small, medium, large, digit）をランダムに選び、
   * それに応じた不正解を生成します。
   * @param correctAnswer 正解の数値
   * @returns 生成された不正解の選択肢
   */
  private generateRandomOption(correctAnswer: number): number {
    const errorType = sample(['small', 'medium', 'large', 'digit']);
    let error;

    switch (errorType) {
      case 'small': {
        error = Math.floor(Math.random() * 5) + 1;
        return correctAnswer + (Math.random() < 0.5 ? error : -error);
      }
      case 'medium': {
        error = Math.floor(Math.random() * 20) + 5;
        return correctAnswer + (Math.random() < 0.5 ? error : -error);
      }
      case 'large': {
        error = Math.floor(Math.random() * 100) + 20;
        return correctAnswer + (Math.random() < 0.5 ? error : -error);
      }
      case 'digit': {
        const s = correctAnswer.toString();
        const i = Math.floor(Math.random() * s.length);
        let d = parseInt(s[i], 10);
        d = (d + Math.floor(Math.random() * 9) + 1) % 10;
        return parseInt(s.substring(0, i) + d + s.substring(i + 1), 10);
      }
      default:
        return correctAnswer + 1;
    }
  }
}
