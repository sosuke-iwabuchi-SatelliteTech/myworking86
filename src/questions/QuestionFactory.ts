import { GameLevel } from '../types';
import { QuestionGenerator } from './QuestionGenerator';
import { Grade1CalcGenerator } from './Grade1CalcGenerator';
import { Grade2KukuGenerator } from './Grade2KukuGenerator';
import { Grade4GeometryGenerator } from './Grade4GeometryGenerator';
import { Grade4MultiplicationGenerator } from './Grade4MultiplicationGenerator';

export class QuestionFactory {
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
