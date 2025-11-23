export type GameLevel = 1 | 2;
export type Screen = 'welcome' | 'quiz' | 'result';

export interface Question {
    text: string;
    correctAnswer: number;
    options: number[];
}

export interface GameState {
    screen: Screen;
    level: GameLevel;
    currentQuestionIndex: number;
    score: number;
    totalQuestions: number;
    startTime: number | null;
    finalTime: number;
}
