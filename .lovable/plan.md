# Ubuntu 24.04 Server Setup (same as your CentOS 9 deploy)

This does exactly what we set up on CentOS 9 — host the SSR site under a subpath (e.g. `/barbershop`), run it with PM2, serve it through Nginx, and auto-deploy from GitHub every 2 minutes via cron. The only real differences from CentOS are the package manager (`apt` instead of `dnf`) and the firewall (`ufw` instead of `firewalld`); there's no SELinux on Ubuntu.

## What I'll add to the repo

A new `deploy/install-ubuntu.sh` — the Ubuntu twin of the existing `deploy/install-site.sh`. Same flags and behavior, adapted for Ubuntu 24.04:
- `apt-get` for Nginx, Node.js, Git, curl
- `ufw` firewall rules (instead of `firewall-cmd`)
- No SELinux step (not present on Ubuntu)
- Bun + PM2 install, build with `VITE_BASE_PATH`, PM2 start + boot persistence, Nginx subpath config, optional domain + HTTPS via certbot

Everything else (the deploy loop, `deploy.sh`, the cron job) is identical to what you already have, because those are OS-agnostic.

---

## Manual step-by-step (what you run on the new Ubuntu box)

### Step 0 — Connect & become root
```bash
ssh youruser@YOUR_SERVER_IP
sudo -i
```

### Step 1 — Install system packages
```bash
apt-get update
apt-get install -y nginx git curl
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
systemctl enable --now nginx
```

### Step 2 — Install Bun + PM2
```bash
export BUN_INSTALL=/usr/local
curl -fsSL https://bun.sh/install | bash
npm install -g pm2
```

### Step 3 — Open the firewall
```bash
ufw allow 'Nginx Full'    # opens 80 + 443
ufw allow OpenSSH         # keep SSH open so you don't lock yourself out
ufw --force enable
```

### Step 4 — Get the code
```bash
git clone <YOUR_GITHUB_REPO_URL> /var/www/barbershop
cd /var/www/barbershop
```

### Step 5 — Build with the subpath
```bash
bun install
VITE_BASE_PATH=/barbershop bun run build
```
This produces the server at `.output/server/index.mjs`.

### Step 6 — Start with PM2 + survive reboots
```bash
PORT=3001 pm2 start .output/server/index.mjs --name barbershop --interpreter node
pm2 save
pm2 startup systemd
```
Run the one command PM2 prints out (it enables boot startup).

### Step 7 — Configure Nginx for the subpath
Create `/etc/nginx/conf.d/lovable-sites.conf` with a server block that:
- redirects `/barbershop` → `/barbershop/`
- serves hashed assets from `.output/public/assets/`
- proxies `/barbershop/` to `http://localhost:3001/barbershop/`

(Identical to the CentOS Nginx block — same paths on Ubuntu.) Then:
```bash
nginx -t
systemctl reload nginx
```

### Step 8 — Auto-deploy cron (every 2 min)
The repo's `deploy.sh` already handles fetch → detect change → pull → build → PM2 restart. Just register it:
```bash
chmod +x /var/www/barbershop/deploy.sh
(crontab -l 2>/dev/null; echo '*/2 * * * * /var/www/barbershop/deploy.sh >> /var/www/barbershop/deploy.log 2>&1') | crontab -
crontab -l
```

### Step 9 — (Optional) Domain + free HTTPS
```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com --redirect
```

---

## The one-command alternative

Once `deploy/install-ubuntu.sh` is in the repo, instead of Steps 1–7 you can just run:
```bash
git clone <REPO_URL> /var/www/barbershop
cd /var/www/barbershop
sudo APP_NAME=barbershop PORT=3001 BASE_PATH=/barbershop ./deploy/install-ubuntu.sh
```
Then do Step 8 (cron) and optionally Step 9 (domain).

---

## Verify it works
```bash
curl http://localhost:3001/barbershop      # local check
pm2 list                                   # process running
tail -f /var/www/barbershop/deploy.log     # watch auto-deploys
```
Then visit `http://YOUR_SERVER_IP/barbershop` in a browser. After this, any change you make in Lovable pushes to GitHub and the server picks it up within ~2 minutes — no manual steps.

## Technical notes
- Node-server preset is already set in `vite.config.ts` (`nitro: { preset: "node-server" }`), so `bun run build` emits `.output/server/index.mjs` — same as CentOS.
- I'll also save an Ubuntu auto-deploy memory entry so future sessions know this workflow exists for Ubuntu too.
