# users (ユーザー)

ユーザー情報を管理します。

| 論理名 | 物理名 | 型 | Nullable | Key | 説明 |
| --- | --- | --- | --- | --- | --- |
| ID | id | UUID | No | PK | ユーザーID |
| 名前 | name | VARCHAR(255) | No | | ユーザー名 |
| メールアドレス | email | VARCHAR(255) | Yes | | |
| メール確認日時 | email_verified_at | TIMESTAMP | Yes | | |
| パスワード | password | VARCHAR(255) | Yes | | |
| 記憶トークン | remember_token | VARCHAR(100) | Yes | | リメンバーミートークン |
| 作成日時 | created_at | TIMESTAMP | Yes | | |
| 更新日時 | updated_at | TIMESTAMP | Yes | | |
| 2段階認証シークレット | two_factor_secret | TEXT | Yes | | |
| 2段階認証リカバリコード | two_factor_recovery_codes | TEXT | Yes | | |
| 2段階認証確認日時 | two_factor_confirmed_at | TIMESTAMP | Yes | | |
| 学年 | grade | INTEGER | Yes | | 学年 (1-6) |
