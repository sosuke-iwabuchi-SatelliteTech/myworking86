# DevContainer セットアップガイド

このプロジェクトは、Laravel + React (Inertia.js) の開発環境をDevContainerで提供します。

## 必要なもの

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## セットアップ手順

1. **Docker Desktopを起動**
   - Docker Desktopが起動していることを確認してください

2. **VS Codeでプロジェクトを開く**
   ```bash
   code /home/sosuke/project/myworking86
   ```

3. **DevContainerで再度開く**
   - VS Codeの左下の緑色のアイコンをクリック
   - "Reopen in Container" を選択
   - または、コマンドパレット (Ctrl+Shift+P) で "Dev Containers: Reopen in Container" を実行

4. **初回起動時の自動セットアップ**
   - `composer install` が自動実行されます
   - `npm install` が自動実行されます
   - データベースマイグレーションが自動実行されます

## 含まれるサービス

### アプリケーションコンテナ
- PHP 8.3
- Node.js 20
- Composer
- Git
- SQLite3

### データベース
- **SQLite3**
  - データベースファイル: `database/database.sqlite`

## ポート転送

以下のポートが自動的にローカルマシンに転送されます:

- `8000`: Laravel開発サーバー
- `5173`: Vite開発サーバー

## 開発の開始

DevContainerが起動したら、以下のコマンドで開発を開始できます:

```bash
# Laravel + Vite + Queue + Logs を同時起動
composer dev

# または個別に起動
php artisan serve          # Laravel (http://localhost:8000)
npm run dev                # Vite (http://localhost:5173)
php artisan queue:listen   # Queue Worker
php artisan pail           # Logs
```

## 含まれる機能

✅ **PHP 8.3** + Composer  
✅ **Node.js 20** + npm  
✅ **SQLite3**  
✅ **VS Code拡張機能** (PHP Intelephense, ESLint, Prettier, Tailwind CSS IntelliSense等)  
✅ **自動ポート転送**  
✅ **データの永続化**

## インストール済みVS Code拡張機能

### PHP/Laravel
- PHP Intelephense
- PHP Debug (Xdebug)
- Laravel Extra Intellisense
- Laravel Blade Snippets

### JavaScript/React
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense

### 一般開発
- GitLens
- EditorConfig
- DotENV
- Error Lens

## 環境変数の設定

`.env` ファイルは自動的に作成されますが、以下の設定が自動的に適用されます:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/workspace/database/database.sqlite
```

## トラブルシューティング

### コンテナが起動しない
```bash
# Docker Desktopを再起動
# VS Codeでコマンドパレットを開き:
# "Dev Containers: Rebuild Container" を実行
```

### データベース接続エラー
```bash
# コンテナ内で以下を実行:
php artisan migrate:fresh
```

### 依存関係のエラー
```bash
# コンテナ内で以下を実行:
composer install
npm install
```

## データの永続化

SQLite3データベースファイル (`database/database.sqlite`) はワークスペースに保存され、コンテナを再起動しても保持されます。

## コンテナの削除

開発環境を完全にリセットしたい場合:

```bash
# VS Codeでコマンドパレットを開き:
# "Dev Containers: Rebuild Container Without Cache" を実行

# またはターミナルで:
docker-compose -f .devcontainer/docker-compose.yml down -v
```

## 参考リンク

- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
