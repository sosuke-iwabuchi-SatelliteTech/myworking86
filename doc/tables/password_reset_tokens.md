# password_reset_tokens (パスワードリセットトークン)

パスワードリセット要求を管理します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| メールアドレス | email | VARCHAR(255) | No | PK | |
| トークン | token | VARCHAR(255) | No | | |
| 作成日時 | created_at | TIMESTAMP | Yes | | |
