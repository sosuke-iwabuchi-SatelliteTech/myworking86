/**
 * 利用可能なゲームレベルIDを表す型。
 * NOTE: 循環依存を避けるため、`constants.ts`から動的に生成する代わりに手動で定義しています。
 * 新しいレベルを追加する際は、この型定義も更新する必要があります。
 */
export type GameLevel =
  | "grade-1-calc"
  | "grade-2-kuku"
  | "grade-4-geometry"
  | "grade-4-multiplication";

/**
 * 1つの学習ユニット（レベル）を表すインターフェース。
 */
export interface Level {
  id: GameLevel;
  name: string;
  calculationPadAvailable?: boolean;
  numberOfQuestions?: number;
}

/**
 * 1つの学年を表すインターフェース。
 * これには、その学年で利用可能なレベルのリストが含まれます。
 */
export interface Grade {
  grade: number;
  name: string;
  levels: readonly Level[];
}

export type Screen =
  | "welcome"
  | "quiz"
  | "result"
  | "history"
  | "settings"
  | "selectAnswerMode";
export type AnswerMode = "choice" | "calculationPad";

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
