# nodejs-http

Node.js で HTTP サーバーの基礎を学ぶためのシンプルな Web アプリです。  
フォーム送信、ログ出力、Pug、Basic認証、Docker、Render デプロイまでを一通り実装しています。

## Demo
https://one1kazu13-meal-questionnaire.onrender.com

## Features
- Node.js 標準の `http` モジュールによる HTTP サーバー実装
- Pug を使ったフォーム描画
- フォーム送信（POST）とログ出力
- **Basic認証によるログイン機能（http-auth）**
- **`/logout` にアクセスすると 401 を返す簡易ログアウト**
  - Basic認証の仕様上、サーバー側でセッションを破棄できないため、  
    401 を返してブラウザに再認証を要求する形でログアウトを実装
- Render へのデプロイ

## 技術スタック
- Node.js / JavaScript
- Pug
- http-auth（Basic認証）
- Docker
- Render

## Run (Local)
```bash
yarn install
node index.js
```
