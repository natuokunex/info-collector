# AWS Lightsail デプロイ手順

## 1. 前提条件

- AWS アカウント
- X API Bearer Token（後から設定可）
- Discord Webhook URL

## 2. Lightsail インスタンス作成

1. AWS Lightsail コンソール → 「インスタンスの作成」
2. リージョン: 東京 (ap-northeast-1)
3. プラットフォーム: Linux/Unix
4. ブループリント: OS のみ → Ubuntu 22.04 LTS
5. プラン: $5/月（512MB RAM, 1 vCPU）
6. インスタンス名: `info-collector`
7. 「インスタンスの作成」をクリック

## 3. サーバー初期設定

SSH接続後:

```bash
# Node.js インストール
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git インストール
sudo apt-get install -y git build-essential

# アプリ用ディレクトリ
sudo mkdir -p /app
sudo chown ubuntu:ubuntu /app
```

## 4. アプリデプロイ

```bash
cd /app

# リポジトリをクローン（または直接アップロード）
# git clone <your-repo-url> .
# または scp でアップロード

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
nano .env.local
# TWITTER_BEARER_TOKEN=your_token_here
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
# BASE_URL=http://your-lightsail-ip:3000

# ビルド
npm run build

# データディレクトリ作成
mkdir -p data
```

## 5. プロセス管理 (PM2)

```bash
# PM2 インストール
sudo npm install -g pm2

# アプリ起動
pm2 start npm --name "info-collector" -- start

# 自動起動設定
pm2 startup
pm2 save

# ログ確認
pm2 logs info-collector
```

## 6. cron 設定（毎朝7時 JST = UTC 22:00）

```bash
# タイムゾーン設定
sudo timedatectl set-timezone Asia/Tokyo

# cron 追加
crontab -e
```

以下を追加:
```
0 7 * * * cd /app && /usr/bin/node scripts/collect.mjs >> /app/data/collect.log 2>&1
```

## 7. ファイアウォール設定

Lightsail コンソール → ネットワーキング:
- TCP 3000 を追加（カスタム）
- または Nginx をリバースプロキシとして設定

## 8. Nginx リバースプロキシ（推奨）

```bash
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/info-collector << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/info-collector /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

## 9. HTTPS 設定（Let's Encrypt）

独自ドメインがある場合:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 10. 静的IPの割り当て

Lightsail コンソール → ネットワーキング → 静的IPの作成 → インスタンスにアタッチ

## iPhoneからのアクセス

- `http://<静的IP>` でアクセス
- ホーム画面に追加: Safari → 共有ボタン → 「ホーム画面に追加」
- PWA的に使用可能

## トラブルシューティング

```bash
# アプリのステータス確認
pm2 status

# ログ確認
pm2 logs info-collector --lines 50

# 手動で収集テスト
curl -X POST http://localhost:3000/api/collect

# DB確認
sqlite3 /app/data/articles.db "SELECT COUNT(*) FROM articles;"

# 収集ログ確認
tail -50 /app/data/collect.log
```
