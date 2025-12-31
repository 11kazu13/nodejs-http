'use strict';
const http = require('node:http');
const pug = require('pug');
const auth = require('http-auth');
const basic = auth.basic(
  { realm: 'Enquetes Area.' },
  (username, password, callback) => {
    callback(username === 'guest' && password === 'xaXZJQmE');
  }
);
const server = http
  .createServer(basic.check((req, res) => {
    console.info( // アクセスログをコンソールに出力
      `Requested by ${req.socket.remoteAddress}`
    );

    // ログアウト処理実装のための条件分岐
    if (req.url === '/logout') {
      res.writeHead(401, { // クライアントエラー番号
        'Content-Type': 'text/plain; charset=utf-8'
      });
      res.end('ログアウトしました');
      return; // 処理を強制終了してログアウト
    }

    res.writeHead(200, { // 200→OK
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケートフォーム</h1>' +
            '<a href="/enquetes">アンケート一覧</a>' +
            '</body></html>');
        } else if (req.url === '/enquetes') {
          res.write('<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケート一覧</h1><ul>' +
            '<li><a href="/enquetes/yaki-tofu">焼き肉・湯豆腐</a></li>' +
            '<li><a href="/enquetes/rice-bread">ごはん・パン</a></li>' +
            '<li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>' +
            '</ul></body></html>');
        } else if (req.url === '/enquetes/yaki-tofu') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '焼肉',
            secondItem: '湯豆腐'
          }));
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: 'ごはん',
            secondItem: 'パン'
          }));
        } else if (req.url === '/enquetes/sushi-pizza') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '寿司',
            secondItem: 'ピザ'
          }));
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const decoded = decodeURIComponent(rawData);
            console.info(`投稿: ${decoded}`);
            const answer = new URLSearchParams(rawData);
            res.write(`<h1>${answer.get('name')}さんは、${answer.get('favorite')}に投票しました。</h1>`);
            res.end();
          });
        break;
      case 'DELETE':
        res.write(`DELETE でアクセスされました ${req.url}`);
        res.end();
        break;
      default:
        break;
    }
  }))
  .on('error', e => { // サーバー側のエラー
    console.error(`Server Error`, e);
  })
  .on('clientError', e => { // クライアント側のエラー
    console.error(`Client Error`, e);
  });

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});