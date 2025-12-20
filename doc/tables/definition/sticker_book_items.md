# sticker_book_items

ユーザーごとのシール帳に配置されたシールの情報を管理するテーブル。

## カラム定義

| カラム名 | 物理名 | 型 | NULL | デフォルト | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ID | id | uuid | NO | - | プライマリキー |
| ユーザーID | user_id | uuid | NO | - | ユーザーへの外部キー |
| ユーザー景品ID | user_prize_id | uuid | NO | - | ユーザー景品への外部キー (1シール1アイテム制約) |
| X座標 | position_x | integer | NO | 0 | キャンバス上のX位置 |
| Y座標 | position_y | integer | NO | 0 | キャンバス上のY位置 |
| 拡大率 | scale | decimal(5,2) | NO | 1.00 | シールの倍率 |
| 回転角度 | rotation | decimal(5,2) | NO | 0.00 | シールの回転角度 (度) |
| 作成日時 | created_at | timestamp | YES | - | |
| 更新日時 | updated_at | timestamp | YES | - | |

## インデックス

| 名前 | カラム | ユニーク | 備考 |
| :--- | :--- | :--- | :--- |
| PRIMARY | id | YES | |
| sticker_book_items_user_id_index | user_id | NO | ユーザーごとの検索用 |
| sticker_book_items_user_prize_id_unique | user_prize_id | YES | 1つの景品は1回しか貼れない |
