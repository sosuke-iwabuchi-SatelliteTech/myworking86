/**
 * アプリケーションで利用可能な学年とレベルの定義。
 * 各学年には、その学年でプレイできるレベル（単元）のリストが含まれています。
 */
export const GRADES = [
  {
    grade: 1,
    name: "1ねんせい",
    levels: [
      {
        id: "grade-1-calc",
        name: "たしざん・ひきざん",
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
      },
      {
        id: "grade-4-multiplication",
        name: "2桁のかけ算",
        calculationPadAvailable: true,
      },
    ],
  },
];

/**
 * localStorageに設定を保存する際のキー
 */
export const SETTINGS_STORAGE_KEY = "quiz_settings";
