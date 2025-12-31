'use strict';
const http = require('node:http');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info( // アクセスログをコンソールに出力
      `[${now}] Requested by ${req.socket.remoteAddress}`
    );
    res.writeHead(200, { // 200→OK
      'Content-Type': 'text/plain; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        res.write(`GET でアクセスされました ${req.url}`);
        break;
      case 'POST':
        res.write(`POST でアクセスされました ${req.url}`);
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            console.info(`[${now}] Data posted: ${rawData}`);
          });
        break;
        default:
          break;
    }
    res.end();
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