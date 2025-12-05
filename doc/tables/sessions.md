# sessions (セッション)

ユーザーセッションをデータベースで管理する場合に使用します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| ID | id | VARCHAR(255) | No | PK | セッションID |
| ユーザーID | user_id | BIGINT | Yes | IDX | ログインユーザーID |
| IPアドレス | ip_address | VARCHAR(45) | Yes | | |
| User Agent | user_agent | TEXT | Yes | | ブラウザ情報 |
| ペイロード | payload | LONGTEXT | No | | セッションデータ |
| 最終アクティビティ | last_activity | INTEGER | No | IDX | 最終アクセス日時(Unix Timestamp) |
