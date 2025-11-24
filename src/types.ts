import { LEVEL_IDS } from './constants';

export type GameLevel = typeof LEVEL_IDS[keyof typeof LEVEL_IDS];
export type Screen = 'welcome' | 'quiz' | 'result' | 'history';

export interface HistoryRecord {
    timestamp: number;
    score: number;
    level: GameLevel;
    time?: number; // Time taken in milliseconds
}

export interface GeometryData {
    shape: 'rectangle' | 'triangle' | 'trapezoid';
    dimensions: {
        width?: number; // Base for triangle/rectangle, Lower base for trapezoid
        height?: number;
        upper?: number; // Upper base for trapezoid
    };
}

export interface Question {
    text: string;
    correctAnswer: number;
    options: number[];
    geometry?: GeometryData;
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
