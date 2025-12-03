# 開発環境について (Development Environment)

本プロジェクトでは、開発環境の統一化とセットアップの簡略化のために DevContainer を導入しています。

## DevContainer の構成

*   **ベースイメージ**: `mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm` (Node.js v22)
*   **タイムゾーン**: Asia/Tokyo (JST)

### 含まれるツール

*   **Node.js**: v22 LTS
*   **npm**: パッケージ管理
*   **Playwright**: E2Eテスト実行用ブラウザと依存関係 (`postCreateCommand` でインストール)

### 自動インストールされる VS Code 拡張機能

*   **ESLint** (`dbaeumer.vscode-eslint`): コードの静的解析
*   **Prettier** (`esbenp.prettier-vscode`): コードフォーマッター
*   **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Tailwind CSS の補完

## 利用方法

VS Code でプロジェクトを開き、「Reopen in Container」を選択することで、環境構築済みのコンテナ内で開発を開始できます。
コンテナ起動時に `npm install` と `npx playwright install --with-deps` が自動的に実行されます。
