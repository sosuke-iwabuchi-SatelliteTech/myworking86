import { Grade, MedalCriteria } from "./types";

/**
 * デフォルトのメダル獲得条件
 * 金: 20秒以内, 銀: 30秒以内
 */
export const DEFAULT_MEDAL_CRITERIA: MedalCriteria = {
  goldThreshold: 20000,
  silverThreshold: 30000,
};

/**
 * アプリケーションで利用可能な学年とレベルの定義。
 * 各学年には、その学年でプレイできるレベル（単元）のリストが含まれています。
 */
export const GRADES: readonly Grade[] = [
  {
    grade: 1,
    name: "1ねんせい",
    levels: [
      {
        id: "grade-1-calc",
        name: "たしざん・ひきざん",
        numberOfQuestions: 10,
        medalCriteria: DEFAULT_MEDAL_CRITERIA,
      },
    ],
  },
  {
    grade: 2,
    name: "2ねんせい",
    levels: [
      {
        id: "grade-2-kuku",
        name: "九九",
        numberOfQuestions: 10,
        medalCriteria: DEFAULT_MEDAL_CRITERIA,
      },
    ],
  },
  {
    grade: 4,
    name: "4ねんせい",
    levels: [
      {
        id: "grade-4-geometry",
        name: "図形の面積",
        numberOfQuestions: 5,
        textbookUrl: "/textbook/grade-4-geometry.html",
        medalCriteria: DEFAULT_MEDAL_CRITERIA,
      },
      {
        id: "grade-4-multiplication",
        name: "2桁のかけ算",
        calculationPadAvailable: true,
        numberOfQuestions: 5,
        medalCriteria: DEFAULT_MEDAL_CRITERIA,
      },
    ],
  },
];

/**
 * localStorageに設定を保存する際のキー
 */
export const SETTINGS_STORAGE_KEY = "quiz_settings";
