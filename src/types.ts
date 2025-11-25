import { GRADES } from "./constants";

export type GameLevel = (typeof GRADES)[number]["levels"][number]["id"];
export type Screen =
  | "welcome"
  | "quiz"
  | "result"
  | "history"
  | "settings"
  | "selectAnswerMode";
export type AnswerMode = "choice" | "calculationPad";

export interface HistoryRecord {
  timestamp: number;
  score: number;
  level: GameLevel;
  time?: number; // Time taken in milliseconds
  grade?: number;
}

export interface GeometryData {
  shape: "rectangle" | "triangle" | "trapezoid";
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
  num1?: number;
  num2?: number;
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

export interface GameSettings {
  showTimer: boolean;
}
