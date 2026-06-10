# Goal

Run your site 100% from your own CentOS VPS at **`http://YOUR_IP/barbershop`**, using GitHub to move the code and a single install script to do everything on the server.

The subpath code change (`VITE_BASE_PATH`) and the install script (`deploy/install-site.sh`) are already in the project from earlier — no further code changes are needed for a bare-IP setup.

---

## Part A — Things only you can do (2 manual steps)

These can't be automated from here; they take ~5 minutes.

### 1. Connect this project to GitHub
- In the editor, open the **Plus (+) menu** (bottom-left of the chat) → **GitHub** → **Connect project**
- Authorize the Lovable GitHub App, pick your account, click **Create Repository**
- Copy the new repo URL (looks like `https://github.com/YOUR_NAME/barber-cozy-glow.git`)

### 2. SSH into your server
- `ssh root@YOUR_IP` (use your server login/password)

---

## Part B — One command on the server (the script does the rest)

Once you're SSH'd in, download the script from your new GitHub repo and run it:

```bash
# grab the script from your repo (replace with YOUR repo's raw URL)
curl -fsSL https://raw.githubusercontent.com/YOUR_NAME/barber-cozy-glow/main/deploy/install-site.sh -o install-site.sh
chmod +x install-site.sh

# run it: clones your repo, builds for /barbershop, starts it, configures Nginx
sudo APP_NAME=barbershop \
     REPO_URL=https://github.com/YOUR_NAME/barber-cozy-glow.git \
     ./install-site.sh
```

The script automatically:
1. Installs Nginx, Node, git, Bun, PM2
2. Opens the firewall + fixes SELinux
3. Clones your GitHub repo into `/var/www/barbershop`
4. Builds with `VITE_BASE_PATH=/barbershop`
5. Starts the app on port 3001 with PM2 (auto-restarts on reboot)
6. Writes the Nginx config and reloads it

When it finishes it prints the live URL: **`http://YOUR_IP/barbershop`**.

---

## Updating the site later

Whenever you change the site here in the editor, it auto-pushes to GitHub. To deploy the update, SSH in and run:

```bash
cd /var/www/barbershop
git pull
VITE_BASE_PATH=/barbershop bun run build
pm2 restart barbershop
```

(Or just re-run the install script — it pulls + rebuilds safely.)

---

## Adding more sites later (e.g. restaurant)

Same script, different name/port/path:

```bash
sudo APP_NAME=restaurant PORT=3002 BASE_PATH=/restaurant \
     REPO_URL=https://github.com/YOUR_NAME/restaurant.git \
     ./install-site.sh
```

It appends a new block to the same Nginx config — no conflicts. Result: `http://YOUR_IP/restaurant`.

---

## Technical notes

- **No code changes needed** for this plan — the subpath base-path support and the script already exist in the repo.
- HTTPS is skipped for now (a bare IP can't get an SSL cert). When you have a domain, re-run with `DOMAIN=yourdomain.com` and the script runs certbot automatically.
- If anything errors during the server run, paste the output back here and I'll fix it with you step by step.

---

## What I'll do once you switch to build mode

Nothing further is required in the code for the bare-IP path — everything is already in place. If after connecting GitHub you want me to verify the script against your actual repo name/URL or tweak ports/paths, I can adjust `deploy/install-site.sh` accordingly.
