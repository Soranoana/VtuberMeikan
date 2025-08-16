# プロフィール投稿サイト

React + Next.js + PostgreSQLで構築されたプロフィール投稿サイトです。

## 機能

- プロフィールの新規投稿
- 投稿されたプロフィールの検索
- 投稿されたプロフィールの閲覧
- 投稿されたプロフィールの削除
- 投稿されたプロフィールの編集

## 技術スタック

- **フロントエンド**: React 18 + Next.js 14 + TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: PostgreSQL 15
- **コンテナ**: Docker + Docker Compose
- **データベース管理**: pgAdmin

## セットアップ

### 前提条件

- Docker
- Docker Compose
- Node.js 18以上（ローカル開発用）

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd vtuber-meikan
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

必要に応じて`.env.local`ファイルの値を編集してください。

### 3. Docker環境での起動

#### データベースのみ起動（推奨）

```bash
# PostgreSQLとpgAdminを起動
docker-compose up -d

# アプリケーションをローカルで起動
npm install
npm run dev
```

#### 全環境をDockerで起動

```bash
# 全サービスを起動
docker-compose -f docker-compose.dev.yml up -d
```

### 4. アクセス

- **アプリケーション**: http://localhost:3000
- **pgAdmin**: http://localhost:8080
  - メール: admin@example.com
  - パスワード: admin

## 開発

### データベース接続確認

```bash
# ヘルスチェックAPI
curl http://localhost:3000/api/health
```

### ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

### Dockerコマンド

```bash
# サービスの起動
docker-compose up -d

# サービスの停止
docker-compose down

# ログの確認
docker-compose logs -f

# データベースのリセット
docker-compose down -v
docker-compose up -d
```

## データベース構造

### profiles テーブル

| カラム名 | 型 | 説明 |
|---------|----|----|
| id | UUID | プライマリキー |
| name | VARCHAR(255) | 名前（必須） |
| age | INTEGER | 年齢 |
| bio | TEXT | 自己紹介 |
| email | VARCHAR(255) | メールアドレス |
| location | VARCHAR(255) | 居住地 |
| interests | TEXT | 興味・趣味 |
| avatar | TEXT | アバター画像URL |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

## 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| DB_HOST | localhost | データベースホスト |
| DB_PORT | 5432 | データベースポート |
| DB_NAME | vtuber_meikan | データベース名 |
| DB_USER | postgres | データベースユーザー |
| DB_PASSWORD | password | データベースパスワード |

## トラブルシューティング

### データベース接続エラー

1. PostgreSQLコンテナが起動しているか確認
```bash
docker-compose ps
```

2. データベース接続をテスト
```bash
curl http://localhost:3000/api/health
```

3. pgAdminでデータベースに接続できるか確認

### ポート競合

- ポート3000が使用中の場合、別のポートを指定
- ポート5432が使用中の場合、`docker-compose.yml`でポートマッピングを変更

## ライセンス

MIT License
