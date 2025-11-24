import { GameLevel } from '../types';
import { LEVEL_IDS } from '../constants';
import { QuestionGenerator } from './QuestionGenerator';
import { Grade1CalcGenerator } from './Grade1CalcGenerator';
import { Grade2KukuGenerator } from './Grade2KukuGenerator';
import { Grade4GeometryGenerator } from './Grade4GeometryGenerator';

export class QuestionFactory {
    static create(level: GameLevel): QuestionGenerator {
        switch (level) {
            case LEVEL_IDS.GRADE_1_CALC:
                return new Grade1CalcGenerator();
            case LEVEL_IDS.GRADE_2_KUKU:
                return new Grade2KukuGenerator();
            case LEVEL_IDS.GRADE_4_GEOMETRY:
                return new Grade4GeometryGenerator();
            default:
                throw new Error(`Generator not found for level: ${level}`);
        }
    }
}
