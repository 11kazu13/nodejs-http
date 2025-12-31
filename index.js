'use strict';
const http = require('node:http');
const fs = require('node:fs');
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
        const rs = fs.createReadStream('./form.html');
        rs.pipe(res);
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
            res.write(`<h1>${answer.get('name')}さんは、${answer.get('yaki-tofu')}に投票しました。</h1>`);
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