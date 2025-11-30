# データ構造 (Data Structure)

## レベル定義 (`src/constants.ts`)

レベルの定義を、学年ごとにグループ化された階層構造に変更しました。これにより、上記の2段階選択フローを効率的に実装しています。

**変更後のデータ構造 (`GRADES`)**:
```typescript
[
  {
    grade: 1,
    name: "1ねんせい",
    levels: [
      { id: "grade-1-calc", name: "たしざん・ひきざん" },
      // ...
    ]
  },
  // ...
]
```

## ユーザー管理と履歴データ

ユーザーごとに個別の学習履歴を管理するため、データ構造を刷新しました。

### ユーザー (`src/types.ts`)
```typescript
export interface User extends UserProfile {
  id: string; // UUID
}
```

### ストレージ構造 (`src/utils/storage.ts`)
*   **`quiz_users`**: 登録済みユーザーのリストを保存。
*   **`quiz_current_user_id`**: 現在アクティブなユーザーIDを保存。
*   **`quiz_history_{userId}`**: 各ユーザーごとのプレイ履歴を個別のキーで保存。

### マイグレーション
従来のデータ構造（単一ユーザー）からの移行ロジックを実装しています。
*   アプリ起動時、新しいユーザーリストが存在せず、かつ古いユーザープロフィールが存在する場合、それを自動的に「1人目のユーザー」として移行し、IDを割り当てます。
*   既存の履歴データも、そのユーザーに紐づく形で引き継がれます。

## 履歴データ (`src/types.ts`)

プレイ履歴を保存する `HistoryRecord` 型に、プレイした学年を記録するための `grade` フィールド（オプショナル）を追加しました。

```typescript
export interface HistoryRecord {
  timestamp: number;
  score: number;
  level: GameLevel;
  time?: number;
  grade?: number; // 追加
}
```
これにより、履歴画面で学年ごとの成績をより分かりやすく表示できるようになりました。古いデータには `grade` がないため、その場合は学年表示が省略されます。

## システム情報 (System Info)

### ビルドバージョン
アプリケーションのビルド日時を追跡するために、Viteの機能を使用してビルド時にバージョン情報を埋め込んでいます。

*   **定数**: `__BUILD_VERSION__`
*   **形式**: `vYYYYMMDD-HHmm` (例: `v20240101-1200`)
*   **タイムゾーン**: 日本時間 (JST)
*   **仕組み**: `vite.config.ts` で現在日時を取得し、`define` オプション経由でグローバル定数として注入されます。設定画面などで表示されます。
