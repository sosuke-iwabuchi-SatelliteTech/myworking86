import { Question, GeometryData, AnswerMode } from '../types';
import { QuestionGenerator } from './QuestionGenerator';

export class Grade4GeometryGenerator implements QuestionGenerator {
    generate(answerMode: AnswerMode): Question {
        let text = '';
        let correctAnswer = 0;
        let geometry: GeometryData | undefined;

        const shapeType = Math.random();

        if (shapeType < 0.33) {
            // Rectangle
            const w = Math.floor(Math.random() * 8) + 2;
            const h = Math.floor(Math.random() * 8) + 2;
            correctAnswer = w * h;
            text = "たて × よこ";
            geometry = { shape: 'rectangle', dimensions: { width: w, height: h } };
        } else if (shapeType < 0.66) {
            // Triangle
            let w = Math.floor(Math.random() * 8) + 2;
            let h = Math.floor(Math.random() * 8) + 2;
            if ((w * h) % 2 !== 0) {
                w += 1;
            }
            correctAnswer = (w * h) / 2;
            text = "ていへん × たかさ ÷ 2";
            geometry = { shape: 'triangle', dimensions: { width: w, height: h } };
        } else {
            // Trapezoid
            let upper = Math.floor(Math.random() * 6) + 2;
            let lower = upper + Math.floor(Math.random() * 5) + 2;
            let h = Math.floor(Math.random() * 6) + 2;

            // Ensure area is integer: (upper + lower) * h must be even
            if (((upper + lower) * h) % 2 !== 0) {
                h++; // h was odd, now even. product is even.
            }

            correctAnswer = ((upper + lower) * h) / 2;
            text = "（じょうてい ＋ かてい）× たかさ ÷ 2";
            geometry = { shape: 'trapezoid', dimensions: { width: lower, height: h, upper: upper } };
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
            geometry
        };
    }
}
