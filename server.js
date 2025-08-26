// Node.jsの標準モジュールであるhttpを読み込む
const http = require('http');

// サーバーが待ち受けるホスト名とポート番号
const HOST = '0.0.0.0'; // どのネットワークインターフェースからの接続も受け付ける
const PORT = process.env.PORT || 8090; // デバイス側の設定に合わせる

// httpサーバーを作成
const server = http.createServer((req, res) => {
  // リクエストのbodyを格納するための変数
  let body = '';

  // データのかたまり(chunk)を受信するたびに実行
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  // 全てのデータを受信し終わったら実行
  req.on('end', () => {
    // ----- ここからがハートビート受信時の処理 -----

    console.log('-----------------------------------------');
    console.log(`[${new Date().toLocaleString('ja-JP')}] ハートビートを受信しました。`);

    // 送信元デバイスのIPアドレスを取得
    const clientIp = req.socket.remoteAddress;
    console.log(`送信元IPアドレス: ${clientIp}`);

    // リクエストのメソッドとURLを表示
    console.log(`メソッド: ${req.method}`);
    console.log(`URL: ${req.url}`);

    // リクエストヘッダーを表示 (デバッグに役立ちます)
    console.log('ヘッダー:');
    console.log(JSON.stringify(req.headers, null, 2));

    // もしbodyにデータがあれば表示 (デバイスIDなどがJSON形式で送られてくることが多い)
    if (body) {
      console.log('受信データ (Body):');
      console.log(body);
    } else {
      console.log('受信データ (Body): なし');
    }

    console.log('-----------------------------------------\n');

    // ----- ここまでがハートビート受信時の処理 -----

    // デバイス側に応答を返す
    // これを返さないと、デバイス側がタイムアウトする可能性がある
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Heartbeat received successfully.\n');
  });
});

// 指定したホストとポートでサーバーを起動
server.listen(PORT, HOST, () => {
  console.log(`サーバーが起動しました。`);
  console.log(`デバイスのコールバック設定には以下のURLを入力してください:`);
  console.log(`http://<このPCのIPアドレス>:${PORT}`);
  console.log('待機中...');
});
