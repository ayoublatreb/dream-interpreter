#!/bin/bash

# Deployment script for Dream Interpreter
# Run this on your server as root

set -e

# Configuration
DOMAIN="ahlamok.com"
BACKEND_DIR="/var/www/dream-interpreter/backend"
FRONTEND_DIR="/var/www/dream-interpreter/frontend"
PROJECT_DIR="/root/dream-interpreter"

echo "=== Dream Interpreter Deployment ==="

# 1. Create directories
echo "[1/6] Creating directories..."
mkdir -p $FRONTEND_DIR/out
mkdir -p $BACKEND_DIR

# 2. Build frontend
echo "[2/6] Building frontend..."
cd $PROJECT_DIR/frontend
npm install
npm run build

# 3. Copy frontend build to web root
echo "[3/6] Copying frontend to web root..."
rm -rf $FRONTEND_DIR/out/*
cp -r $PROJECT_DIR/frontend/out/* $FRONTEND_DIR/out/

# 4. Setup backend
echo "[4/6] Setting up backend..."
cp -r $PROJECT_DIR/backend/* $BACKEND_DIR/
cd $BACKEND_DIR
npm install --production

# 5. Create systemd service for backend
echo "[5/6] Creating backend service..."
cat > /etc/systemd/system/dream-interpreter-backend.service << 'EOF'
[Unit]
Description=Dream Interpreter Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/dream-interpreter/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Enable and start backend service
systemctl daemon-reload
systemctl enable dream-interpreter-backend
systemctl restart dream-interpreter-backend

# 6. Setup Nginx
echo "[6/6] Setting up Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name ahlamok.com www.ahlamok.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name ahlamok.com www.ahlamok.com;

    ssl_certificate /etc/letsencrypt/live/ahlamok.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ahlamok.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/dream-interpreter/frontend/out;
    index index.html;

    # Serve static Next.js files
    location /_next/ {
        alias /var/www/dream-interpreter/frontend/out/_next/;
        access_log off;
        expires max;
    }

    location /static/ {
        alias /var/www/dream-interpreter/frontend/out/static/;
        access_log off;
        expires max;
    }

    # PWA / favicon / manifest
    location /sw.js { root /var/www/dream-interpreter/frontend/out; }
    location /manifest.webmanifest { root /var/www/dream-interpreter/frontend/out; }
    location /favicon.ico { root /var/www/dream-interpreter/frontend/out; }

    # Catch-all for static pages (SPA routing)
    location / {
        try_files $uri /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo "=== Deployment Complete ==="
echo "Backend status: $(systemctl is-active dream-interpreter-backend)"
echo "Frontend: Deployed to $FRONTEND_DIR/out"
echo ""
echo "Note: Make sure you have SSL certificates set up with Let's Encrypt:"
echo "  certbot --nginx -d ahlamok.com -d www.ahlamok.com"
