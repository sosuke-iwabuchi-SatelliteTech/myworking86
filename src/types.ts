import { GRADES } from "./constants";

/**
 * 利用可能なゲームレベルIDを表す型。
 * `constants.ts`の`GRADES`定義から動的に生成されます。
 */
export type GameLevel = (typeof GRADES)[number]["levels"][number]["id"];

/**
 * アプリケーションで表示可能な画面の種類を表す型。
 */
export type Screen = "welcome" | "quiz" | "result" | "history" | "settings";

/**
 * 1回のクイズゲームの履歴レコードを表すインターフェース。
 */
export interface HistoryRecord {
  /**
   * ゲームが完了したときのタイムスタンプ（ミリ秒）
   */
  timestamp: number;
  /**
   * 最終スコア
   */
  score: number;
  /**
   * プレイしたゲームのレベルID
   */
  level: GameLevel;
  /**
   * ゲームにかかった時間（ミリ秒）
   */
  time?: number;
  /**
   * プレイした学年
   */
  grade?: number;
}

/**
 * 図形問題で描画する図形のデータを表すインターフェース。
 */
export interface GeometryData {
  /**
   * 図形の形状
   */
  shape: "rectangle" | "triangle" | "trapezoid";
  /**
   * 図形の寸法
   */
  dimensions: {
    /**
     * 幅（長方形）、底辺（三角形）、下底（台形）
     */
    width?: number;
    /**
     * 高さ
     */
    height?: number;
    /**
     * 上底（台形）
     */
    upper?: number;
  };
}

/**
 * 1つのクイズ問題を表すインターフェース。
 */
export interface Question {
  /**
   * 問題文
   */
  text: string;
  /**
   * 正解の答え
   */
  correctAnswer: number;
  /**
   * 選択肢の配列
   */
  options: number[];
  /**
   * 図形問題の場合の図形データ
   */
  geometry?: GeometryData;
  /**
   * 計算パッドを表示するかどうか
   */
  showCalculationPad?: boolean;
  /**
   * 計算パッドで使用する1番目の数値
   */
  num1?: number;
  /**
   * 計算パッドで使用する2番目の数値
   */
  num2?: number;
}

/**
 * ゲームの現在の状態を表すインターフェース。
 * @deprecated このインターフェースは現在使用されていません。Appコンポーネントのstateが代わりに使用されています。
 */
export interface GameState {
  screen: Screen;
  level: GameLevel;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  startTime: number | null;
  finalTime: number;
}

/**
 * ゲームの設定を表すインターフェース。
 */
export interface GameSettings {
  /**
   * クイズ中にタイマーを表示するかどうか
   */
  showTimer: boolean;
}
