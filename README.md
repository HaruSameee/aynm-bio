# aynm-bio

Discord ユーザー向けのプロフィールホスティングサービスです。  
Discord ログイン後に `/dashboard` でプロフィールを編集し、`/[username]` で公開ページを配信します。

## 概要

- Discord OAuth でログイン
- ホワイトリスト方式でログイン可能ユーザーを制限
- プロフィール本文を `rawHtml` / `rawCss` / `rawJs` として保存
- ダッシュボードで Card / Live の 2 種類プレビューを確認
- `username` ごとの公開ページを Route Handler で直接返却

## 技術スタック

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Auth.js v5
- Drizzle ORM
- postgres.js

## 認証

- Provider は Discord のみ
- `ALLOWED_DISCORD_IDS` に含まれる Discord User ID のみサインイン可能
- `/dashboard` 以下は middleware で保護
- Auth.js は Drizzle Adapter を使って `users` / `accounts` / `sessions` / `verification_tokens` を利用

## プロフィールデータ

`profiles` テーブルには以下を保存します。

- `userId`
- `username`
- `displayName`
- `rawHtml`
- `rawCss`
- `rawJs`
- `createdAt`
- `updatedAt`

`username` はサーバー側でバリデーションしています。

- 3〜32 文字
- 使用可能文字は小文字英数字、`-`、`_`
- `api` / `dashboard` / `_next` などの予約パスは禁止
- `.` を含む名前は禁止

## ダッシュボード

ダッシュボードは Discord 風の UI です。

- 左側に編集フォーム
- 右側にプレビュー
- `Card` タブで Discord ライクなカード表示
- `Live` タブで `iframe srcDoc` による実レンダリング確認

Live プレビューは公開ルートと同じ構造の HTML を使います。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName}</title>
  <style>${rawCss}</style>
</head>
<body>
  ${rawHtml}
  <script>${rawJs}<\/script>
</body>
</html>
```

## 公開ルート

- `/` : トップページ
- `/dashboard` : プロフィール編集画面
- `/[username]` : 公開プロフィールページ
- `/api/auth/[...nextauth]` : Auth.js ハンドラ

`/[username]` は Route Handler で HTML 文字列を直接返します。  
`rawHtml` / `rawCss` / `rawJs` はサニタイズせずそのまま埋め込みます。

## セットアップ

### 1. 依存関係をインストール

```bash
npm install
```

### 2. `.env.local` を作成

```env
AUTH_SECRET=
AUTH_DISCORD_ID=
AUTH_DISCORD_SECRET=
POSTGRES_URL=
ALLOWED_DISCORD_IDS=
```

### 3. マイグレーションを適用

```bash
npm run db:migrate
```

必要に応じて先に migration SQL を生成する場合:

```bash
npm run db:generate
```

### 4. 開発サーバーを起動

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
  lib/
    username.ts
  auth.ts
  types/next-auth.d.ts
middleware.ts
drizzle.config.ts
```

## DB 接続

`src/db/index.ts` では `postgres.js` を使用しています。  
サーバーレス環境向けに以下の設定を入れています。

- `ssl: "require"`
- `max: 1`
- `idle_timeout: 20`
- `connect_timeout: 10`
