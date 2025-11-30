# 問題生成アーキテクチャ (Question Generation Architecture)

コードの保守性と拡張性を高めるため、問題生成ロジックを `QuizScreen.tsx` から切り出し、Strategyパターン（Factoryパターン）を用いてリファクタリングしました。

## 構造

*   **インターフェース**: `QuestionGenerator` (`src/questions/QuestionGenerator.ts`)
    *   `generate(): Question` メソッドを定義。
*   **ファクトリ**: `QuestionFactory` (`src/questions/QuestionFactory.ts`)
    *   ゲームレベル（`GameLevel`）を受け取り、適切な `QuestionGenerator` のインスタンスを返します。
*   **実装クラス** (`src/questions/`):
    *   `Grade1CalcGenerator`: 1年生のたし算・ひき算。
    *   `Grade2KukuGenerator`: 2年生の九九。
    *   `Grade4GeometryGenerator`: 4年生の図形の面積（長方形、三角形、台形）。
    *   `Grade4MultiplicationGenerator`: 4年生の2桁の掛け算。

## 各レベルの問題生成ロジック概要

1.  **1年生 計算 (Grade 1 Calc)**
    *   **たし算**: `(1-10) + (1-10)`
    *   **ひき算**: `(5-19) - (0-num1)` ※答えが負にならないように調整

2.  **2年生 九九 (Grade 2 Kuku)**
    *   `(1-9) × (1-9)`

3.  **4年生 図形 (Grade 4 Geometry)**
    *   **長方形**: `たて(2-9) × よこ(2-9)`
    *   **三角形**: `ていへん(2-9) × たかさ(2-9) ÷ 2`
        *   ※面積が整数になるように、底辺×高さが偶数になるよう調整。
    *   **台形**: `（じょうてい(2-7) ＋ かてい(upper + 2-6)）× たかさ(2-7) ÷ 2`
        *   ※面積が整数になるように、(上底+下底)×高さが偶数になるよう調整。

4.  **4年生 2桁の掛け算 (Grade 4 Multiplication)**
    * `(10-99) x (10-99)`
    * このレベルの問題では、筆算パッドが表示されます。
