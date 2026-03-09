# aynm-bio

Next.js App Router ベースのプロフィールホスティングサービスです。  
Discord ログイン経由でプロフィールを編集し、`/[username]` で HTML を直接配信する構成です。

## 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- Auth.js v5
- Drizzle ORM
- Postgres

## 主な機能

- Discord ログイン
- `/dashboard` でプロフィール編集
- `username` ごとの公開ページ配信
- Drizzle によるスキーマ管理と migration

## 現在の状態

認証まわりはデバッグ中です。現時点では以下の一時対応が入っています。

- Auth.js の Drizzle Adapter は無効化中
- Session 戦略は `jwt`
- `signIn` callback はデバッグログを出したうえで一時的に `return true`
- `logger` を有効化して Auth.js の詳細エラーを出力

そのため、README 上の認証仕様は「本来の目標」ではなく「現在の実装状態」に合わせています。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` を作成して、以下を設定してください。

```env
AUTH_SECRET=
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=
POSTGRES_URL=
ALLOWED_DISCORD_IDS=
```

### 3. マイグレーションの実行

```bash
npm run db:migrate
```

必要に応じて SQL 生成だけ先に行う場合:

```bash
npm run db:generate
```

### 4. 開発サーバー起動

```bash
npm run dev
```

## スクリプト

```bash
npm run dev
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:studio
```

## ディレクトリ構成

```text
src/
  app/
    api/auth/[...nextauth]/route.ts
    dashboard/page.tsx
    [username]/route.ts
    actions.ts
    layout.tsx
    page.tsx
  components/
    ProfileEditor.tsx
  db/
    index.ts
    schema.ts
  auth.ts
  types/next-auth.d.ts
middleware.ts
drizzle.config.ts
```

## DB 接続

`src/db/index.ts` では `postgres.js` を使っています。  
サーバーレス向けに接続数を抑えるため、以下の設定を入れています。

- `max: 1`
- `idle_timeout: 20`
- `connect_timeout: 10`
- `ssl: "require"`

## 公開ルート

- `/` : トップページ
- `/dashboard` : ログイン後の編集画面
- `/[username]` : プロフィール公開ページ
- `/api/auth/[...nextauth]` : Auth.js ハンドラ

## 補足

`/[username]` は Route Handler で HTML を直接返します。  
`rawHtml`、`rawCss`、`rawJs` はサニタイズせず、そのままレスポンスへ埋め込みます。
