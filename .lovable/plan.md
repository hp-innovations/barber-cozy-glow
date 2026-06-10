# Goal

Run your site 100% from your CentOS VPS (`153.75.90.51`) at **`https://corelinkdev.com/barbershop`** (and `www.`), using GitHub to move the code and a single install script to do everything on the server — including free HTTPS.

The bare IP `http://153.75.90.51/barbershop` will also work as a fallback. The subpath code change (`VITE_BASE_PATH`) and the install script (`deploy/install-site.sh`) already exist in the project — no further code changes are needed.

---

## Prerequisite — DNS must point at the server

For HTTPS to work, `corelinkdev.com` and `www.corelinkdev.com` must resolve to `153.75.90.51`. From the earlier DNS setup you added A records:

```text
A   @     153.75.90.51
A   www   153.75.90.51
A   *     153.75.90.51
```

If those are saved, you're ready. (Check with `dig +short corelinkdev.com` — it should return `153.75.90.51`.)

---

## Part A — Things only you can do (manual)

### 1. Connect this project to GitHub
- Editor → **Plus (+) menu** (bottom-left) → **GitHub** → **Connect project**
- Authorize, pick your account, click **Create Repository**
- Copy the repo URL (e.g. `https://github.com/YOUR_NAME/barber-cozy-glow.git`)

### 2. SSH into your server
- `ssh root@153.75.90.51`

---

## Part B — One command on the server

Download the script from your new repo and run it **with the domain set** so it auto-configures HTTPS:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_NAME/YOUR_REPO/main/deploy/install-site.sh -o install-site.sh
chmod +x install-site.sh

sudo APP_NAME=barbershop \
     REPO_URL=https://github.com/YOUR_NAME/YOUR_REPO.git \
     DOMAIN=corelinkdev.com \
     ./install-site.sh
```

The script automatically:
1. Installs Nginx, Node, git, Bun, PM2
2. Opens the firewall + fixes SELinux
3. Clones your repo into `/var/www/barbershop`
4. Builds with `VITE_BASE_PATH=/barbershop`
5. Starts the app on port 3001 with PM2 (auto-restarts on reboot)
6. Writes the Nginx config (`server_name corelinkdev.com`) and reloads it
7. Runs **certbot** to issue a free SSL cert and switch the site to HTTPS

Result: **`https://corelinkdev.com/barbershop`** goes live. The IP URL keeps working too.

---

## Covering `www.` too

The script's `DOMAIN` handles the root domain. To also cover `www.corelinkdev.com` with HTTPS, after the script finishes run:

```bash
sudo certbot --nginx -d corelinkdev.com -d www.corelinkdev.com
```

(One-time; certbot auto-renews afterward.)

---

## Updating the site later

Changes you make in the editor auto-push to GitHub. To deploy them:

```bash
cd /var/www/barbershop
git pull
VITE_BASE_PATH=/barbershop bun run build
pm2 restart barbershop
```

---

## Adding more sites later (e.g. restaurant)

Same script, different name/port/path:

```bash
sudo APP_NAME=restaurant PORT=3002 BASE_PATH=/restaurant \
     REPO_URL=https://github.com/YOUR_NAME/restaurant.git \
     DOMAIN=corelinkdev.com \
     ./install-site.sh
```

Result: `https://corelinkdev.com/restaurant`. It appends a new block to the same Nginx config — no conflicts.

---

## Technical notes

- **No code changes needed** — the subpath support and script already exist in the repo.
- HTTPS requires DNS pointing at the server first. If certbot fails because DNS hasn't propagated yet, the HTTP site still works; just re-run `sudo certbot --nginx -d corelinkdev.com` later.
- If anything errors on the server, paste the output back here and I'll fix it with you step by step.

---

## What I'll do once you switch to build mode

The code is already in place for this path. Once you've connected GitHub and shared your real repo URL, I can fill in the exact command for you and, if you like, double-check the script handles `www.` + the domain the way you want.
