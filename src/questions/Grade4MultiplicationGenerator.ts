import { Question } from "../types";
import { QuestionGenerator } from "./QuestionGenerator";
import { sample, shuffle } from "lodash";

export class Grade4MultiplicationGenerator implements QuestionGenerator {
  generate(): Question {
    const num1 = Math.floor(Math.random() * 90) + 10;
    const num2 = Math.floor(Math.random() * 90) + 10;
    const correctAnswer = num1 * num2;

    const options = this.generateOptions(correctAnswer);

    return {
      text: `${num1} x ${num2}`,
      correctAnswer: correctAnswer,
      options: shuffle(options),
      showCalculationPad: true,
      num1: num1,
      num2: num2,
    };
  }

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

  private generateRandomOption(correctAnswer: number): number {
    const errorType = sample(["small", "medium", "large", "digit"]);
    let error;

    switch (errorType) {
      case "small":
        error = Math.floor(Math.random() * 5) + 1;
        return correctAnswer + (Math.random() < 0.5 ? error : -error);
      case "medium":
        error = Math.floor(Math.random() * 20) + 5;
        return correctAnswer + (Math.random() < 0.5 ? error : -error);
      case "large":
        error = Math.floor(Math.random() * 100) + 20;
        return correctAnswer + (Math.random() < 0.5 ? error : -error);
      case "digit":
        const s = correctAnswer.toString();
        const i = Math.floor(Math.random() * s.length);
        let d = parseInt(s[i], 10);
        d = (d + Math.floor(Math.random() * 9) + 1) % 10;
        return parseInt(s.substring(0, i) + d + s.substring(i + 1), 10);
      default:
        return correctAnswer + 1;
    }
  }
}
