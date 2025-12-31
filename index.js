'use strict';
const http = require('node:http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info( // アクセスログをコンソールに出力
      `[${now}] Requested by ${req.socket.remoteAddress}`
    );
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
            console.info(`[${now}] 投稿: ${decoded}`);
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
  })
  .on('error', e => { // サーバー側のエラー
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', e => { // クライアント側のエラー
    console.error(`[${new Date()}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});