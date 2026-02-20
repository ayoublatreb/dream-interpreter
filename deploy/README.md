# Dream Interpreter - Deployment Guide

## Prerequisites

- Ubuntu/Debian server with root access
- Node.js 18+ installed
- Nginx installed
- Domain pointing to your server (ahlamok.com)

## Quick Deploy

1. Upload the project to your server:
   ```bash
   # On your local machine, create a tarball of the project
   tar -czvf dream-interpreter.tar.gz ./

   # Upload to server via scp
   scp dream-interpreter.tar.gz root@server1:~/

   # SSH into server
   ssh root@server1

   # Extract
   tar -xzvf dream-interpreter.tar.gz
   cd dream-interpreter
   ```

2. Run the deployment script:
   ```bash
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

3. Set up SSL (if not already done):
   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d ahlamok.com -d www.ahlamok.com
   ```

4. Verify everything is working:
   ```bash
   systemctl status dream-interpreter-backend
   curl http://localhost:3001/api/health  # or your health endpoint
   ```

## Manual Setup (Step by Step)

### 1. Build Frontend

```bash
cd frontend
npm install
npm run build
```

The output will be in `frontend/out/`

### 2. Copy to Web Root

```bash
rm -rf /var/www/dream-interpreter
mkdir -p /var/www/dream-interpreter/frontend/out
cp -r frontend/out/* /var/www/dream-interpreter/frontend/out/
```

### 3. Setup Backend

```bash
mkdir -p /var/www/dream-interpreter/backend
cp -r backend/* /var/www/dream-interpreter/backend/
cd /var/www/dream-interpreter/backend
npm install --production
```

Create `.env` file:
```bash
cp .env.example .env
nano .env
```

Start the backend:
```bash
PORT=3001 node server.js &
```

Or create a systemd service (see backend.service)

### 4. Configure Nginx

Copy the Nginx config:
```bash
cp deploy/nginx.conf /etc/nginx/sites-available/ahlamok.com
ln -sf /etc/nginx/sites-available/ahlamok.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 5. SSL Certificate

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d ahlamok.com -d www.ahlamok.com
```

## Project Structure on Server

```
/var/www/dream-interpreter/
├── frontend/
│   └── out/           # Next.js static files
│       ├── _next/     # Static assets
│       ├── static/    # Static files
│       └── index.html # Main app
└── backend/
    ├── server.js      # Express server
    ├── .env           # Environment variables
    └── node_modules/  # Dependencies
```

## Troubleshooting

### Backend not starting
Check logs: `journalctl -u dream-interpreter-backend -f`

### Nginx errors
Check config: `nginx -t`
Check logs: `tail -f /var/log/nginx/error.log`

### API not working
Make sure backend is running: `systemctl status dream-interpreter-backend`
Check backend logs: `journalctl -u dream-interpreter-backend`

## Environment Variables

Backend requires:
- `OPENAI_API_KEY` - Your OpenAI API key
- `PORT` - Backend port (default: 3001)
- `NODE_ENV` - Environment (production/development)
