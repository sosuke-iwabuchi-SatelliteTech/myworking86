import { Question, AnswerMode } from '../types';
import { QuestionGenerator } from './QuestionGenerator';

export class Grade2KukuGenerator implements QuestionGenerator {
    generate(answerMode: AnswerMode): Question {
        const num1 = Math.floor(Math.random() * 9) + 1;
        const num2 = Math.floor(Math.random() * 9) + 1;
        const correctAnswer = num1 * num2;
        const text = `${num1} × ${num2} = ?`;

        // Generate options
        const options = new Set([correctAnswer]);
        while (options.size < 4) {
            let wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
            // Make sure wrong answer is not negative
            if (wrong < 0) wrong = Math.abs(wrong) + 1;

            if (wrong !== correctAnswer) {
                options.add(wrong);
            }
        }

        return {
            text,
            correctAnswer,
            options: Array.from(options).sort(() => Math.random() - 0.5),
        };
    }
}
