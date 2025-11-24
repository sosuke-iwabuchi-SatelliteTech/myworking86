import { Question } from '../types';
import { QuestionGenerator } from './QuestionGenerator';

export class Grade1CalcGenerator implements QuestionGenerator {
    generate(): Question {
        let text = '';
        let correctAnswer = 0;
        const isAddition = Math.random() > 0.5;

        if (isAddition) {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = num1 + num2;
            text = `${num1} + ${num2} = ?`;
        } else {
            const num1 = Math.floor(Math.random() * 15) + 5;
            const num2 = Math.floor(Math.random() * num1);
            correctAnswer = num1 - num2;
            text = `${num1} - ${num2} = ?`;
        }

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
