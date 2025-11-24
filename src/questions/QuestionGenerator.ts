import { Question } from '../types';

export interface QuestionGenerator {
    generate(): Question;
}
