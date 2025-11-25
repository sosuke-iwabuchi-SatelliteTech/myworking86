import { Question, AnswerMode } from '../types';

export interface QuestionGenerator {
    generate(answerMode: AnswerMode): Question;
}
