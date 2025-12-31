'use strict';
const http = require('node:http');
const server = http
  .createServer((req, res) => {
    console.info( // アクセスログをコンソールに出力
      `[${new Date()}] Requested by ${req.socket.remoteAddress}`
    );
    res.writeHead(200, { // 200→OK
      'Content-Type': 'text/plain; charset=utf-8'
    });
    res.write(req.headers['user-agent']);
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