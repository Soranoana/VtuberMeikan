# テーブル定義書（たたき台）

## 1. 目的
- 本書は Vtuber Meikan のDBテーブル定義の初期ドラフトです。
- 既存の [init.sql](../../init.sql) とER図を基に、実装済み項目と未確定項目を整理します。

## 2. 前提
- DB: PostgreSQL
- UUID生成: `pgcrypto` 拡張（`gen_random_uuid()`）
- 更新日時の自動更新: `update_updated_at_column()` トリガー関数

## 3. 命名ルール（案）
- テーブル名: 複数形のスネークケース（例: `profiles`）
- カラム名: スネークケース（例: `created_at`）
- 主キー: `id`（UUID優先）
- 外部キー: `xxx_id`
- 監査カラム: `created_at`, `updated_at`

## 4. テーブル一覧（現状）

| 物理名 | 論理名 | 状態 | 備考 |
|---|---|---|---|
| profiles | プロフィール | 実装済み（init.sql） | 現行APIで利用 |
| users | ユーザー | 実装済み（init.sql） | 認証用の最小構成 |
| vtuber_profiles | VTuberプロフィール | 設計のみ（ER） | `profiles` と統合/分離を要検討 |
| profile_tags | タグ | 設計のみ（ER） | 正規化案 |
| profile_sns_links | SNSリンク | 設計のみ（ER） | 現状 `profiles.social_links` と重複可能性あり |
| profile_videos | 動画リンク | 設計のみ（ER） | 別テーブル化案 |
| profile_likes | いいね履歴 | 設計のみ（拡張ER） | `users`/`profiles` 参照想定 |

---

## 5. テーブル定義詳細

### 5.1 profiles（プロフィール）

#### 概要
- 目的: VTuberプロフィールの基本情報を保持する。
- 参照元: `init.sql`

#### カラム定義

| No | カラム名 | 型 | PK | NN | UQ | デフォルト | 説明 |
|---|---|---|---|---|---|---|---|
| 1 | id | UUID | Y | Y | Y | `gen_random_uuid()` | 主キー |
| 2 | name | VARCHAR(255) |  | Y |  |  | 表示名 |
| 3 | age | INTEGER |  |  |  |  | 年齢 |
| 4 | bio | TEXT |  |  |  |  | 自己紹介 |
| 5 | email | VARCHAR(255) |  |  |  |  | 連絡先メール |
| 6 | location | VARCHAR(255) |  |  |  |  | 活動地域 |
| 7 | interests | TEXT |  |  |  |  | 興味関心 |
| 8 | avatar_url | TEXT |  |  |  |  | アバター画像URL |
| 9 | social_links | JSONB |  |  |  |  | SNSリンクJSON |
| 10 | created_at | TIMESTAMPTZ |  |  |  | `CURRENT_TIMESTAMP` | 作成日時 |
| 11 | updated_at | TIMESTAMPTZ |  |  |  | `CURRENT_TIMESTAMP` | 更新日時 |

#### インデックス
- `idx_profiles_name` (`name`)
- `idx_profiles_created_at` (`created_at` DESC)

#### トリガー
- `update_profiles_updated_at`（UPDATE時に `updated_at` を更新）

#### 備考
- `social_links` は JSONB だが、ER案では `profile_sns_links` への分離もある。運用方針を決定する。

### 5.2 users（ユーザー）

#### 概要
- 目的: 認証・ユーザー識別情報を保持する。
- 参照元: `init.sql`

#### カラム定義

| No | カラム名 | 型 | PK | NN | UQ | デフォルト | 説明 |
|---|---|---|---|---|---|---|---|
| 1 | id | UUID | Y | Y | Y | `gen_random_uuid()` | 主キー |
| 2 | email | VARCHAR(255) |  | Y | Y |  | メールアドレス |
| 3 | display_name | VARCHAR(255) |  |  |  |  | 表示名 |
| 4 | password_hash | TEXT |  |  |  |  | パスワードハッシュ |
| 5 | created_at | TIMESTAMPTZ |  |  |  | `CURRENT_TIMESTAMP` | 作成日時 |
| 6 | updated_at | TIMESTAMPTZ |  |  |  | `CURRENT_TIMESTAMP` | 更新日時 |

#### インデックス
- `email` は UNIQUE 制約によりインデックス作成

#### トリガー
- `update_users_updated_at`（UPDATE時に `updated_at` を更新）

---

### 5.3 設計検討中テーブル（ER由来）

以下はER図ベースのため、DDL未確定です。確定後に本章を正式化します。

#### vtuber_profiles
- 想定主キー: `id` (UUID)
- 主な項目: 名前、所属、活動情報、説明文、画像URL、各種カウント
- TODO:
  - `profiles` と役割重複しているため、統合するか分離するか決定
  - 型の見直し（`birthday` などは `DATE` 化検討）

#### profile_tags
- 想定主キー: `id` (INT)
- 想定外部キー: `profile_id` -> `vtuber_profiles.id`（または `profiles.id`）
- TODO:
  - タグの重複制御（`profile_id`, `tag` の複合UNIQUE）を検討

#### profile_sns_links
- 想定主キー: `id` (INT)
- 想定外部キー: `profile_id`
- TODO:
  - `social_links(JSONB)` との二重管理を避ける方針決定
  - `url` の形式チェック導入可否を検討

#### profile_videos
- 想定主キー: `id` (INT)
- 想定外部キー: `profile_id`
- TODO:
  - YouTube等のURL正規化ルールを定義

#### profile_likes
- 想定主キー: `id` (INT)
- 想定外部キー: `profile_id`, `user_id`
- TODO:
  - 1ユーザー1プロフィール1いいね制約（`profile_id`, `user_id` の複合UNIQUE）を検討

---

## 6. 関連オブジェクト

### 6.1 関数
- `update_updated_at_column()`

### 6.2 トリガー
- `update_profiles_updated_at`
- `update_users_updated_at`

## 7. 未決事項（次アクション）
1. `profiles` と `vtuber_profiles` の統廃合方針を決める
2. SNS/動画の保持形式（JSONB or 正規化テーブル）を決める
3. いいね機能の制約・インデックス設計を確定する
4. 確定内容をもとにマイグレーションDDLを作成する
